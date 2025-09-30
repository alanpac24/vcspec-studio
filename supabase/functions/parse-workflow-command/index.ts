import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { command } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Parsing command:', command);

    // Call Lovable AI to parse the natural language command
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a VC workflow automation expert. Parse user commands into workflow structures.

WORKFLOW TYPES:
- dealflow_triage: Capture inbound deals, enrich data, score fit, route to CRM
- meeting_prep: Detect meetings, pull context, generate briefs
- crm_hygiene: Scan for duplicates/stale deals, suggest fixes
- research_outbound: Research companies, rank fit, draft outreach
- portfolio_lp: Collect portfolio updates, draft LP letters, flag risks

AGENT TEMPLATES:
- Inbound Capture: monitors email/forms/LinkedIn for deals
- Enrichment: pulls external data from Crunchbase/PitchBook/Dealroom
- Scoring: scores deals on stage/sector/traction/founder fit
- Routing: assigns owners in Pipedrive, sends Slack alerts
- Calendar Trigger: detects upcoming meetings
- Brief Builder: generates meeting prep documents
- Data Quality: identifies CRM data issues
- Stale Deal: finds inactive deals
- Research Pack: gathers companies by thesis
- Fit Ranking: ranks companies by fit criteria
- Outbound Drafting: creates personalized outreach
- Update Collector: collects portfolio metrics
- Portfolio Pack: aggregates portfolio data
- LP Draft: creates LP update letters

Respond ONLY with valid JSON in this format:
{
  "workflow_type": "dealflow_triage",
  "name": "Dealflow Triage Workflow",
  "description": "Automated deal processing pipeline",
  "agents": [
    {
      "name": "Inbound Capture Agent",
      "description": "Monitors Gmail, forms, LinkedIn for new deals",
      "inputs": "Email threads, form submissions",
      "outputs": "Structured deal record",
      "integrations": ["Gmail", "LinkedIn", "Forms"],
      "step_order": 1
    }
  ]
}`
          },
          {
            role: 'user',
            content: command
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_workflow",
              description: "Parse a workflow from natural language",
              parameters: {
                type: "object",
                properties: {
                  workflow_type: {
                    type: "string",
                    enum: ["dealflow_triage", "meeting_prep", "crm_hygiene", "research_outbound", "portfolio_lp", "custom"]
                  },
                  name: { type: "string" },
                  description: { type: "string" },
                  agents: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        inputs: { type: "string" },
                        outputs: { type: "string" },
                        integrations: {
                          type: "array",
                          items: { type: "string" }
                        },
                        step_order: { type: "integer" }
                      },
                      required: ["name", "description", "inputs", "outputs", "integrations", "step_order"]
                    }
                  }
                },
                required: ["workflow_type", "name", "description", "agents"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_workflow" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data, null, 2));

    // Extract the workflow structure from tool call
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No workflow structure returned from AI');
    }

    const workflow = JSON.parse(toolCall.function.arguments);
    
    return new Response(JSON.stringify(workflow), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
