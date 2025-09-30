import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WORKFLOW_TEMPLATES = {
  'dealflow-triage': {
    name: 'Dealflow Triage',
    description: 'Capture, enrich, score, and route inbound deals automatically',
    agents: [
      {
        name: 'Inbound Capture Agent',
        description: 'Monitors Gmail, forms, LinkedIn intros for new deal opportunities',
        inputs: 'Email threads, form submissions, LinkedIn messages',
        outputs: 'Structured deal record with company name, founder, source',
        integrations: ['Gmail', 'LinkedIn', 'Forms'],
        step_order: 1
      },
      {
        name: 'Enrichment Agent',
        description: 'Pulls external data on company, founders, traction, funding',
        inputs: 'Company domain or name',
        outputs: 'Enriched profile with metrics, team, investors, news',
        integrations: ['Crunchbase', 'PitchBook', 'Dealroom'],
        step_order: 2
      },
      {
        name: 'Scoring Agent',
        description: 'Scores deals based on stage, sector, traction, founder fit',
        inputs: 'Enriched company profile',
        outputs: 'Fit score (0-100) and priority ranking',
        integrations: ['Custom ML Model'],
        step_order: 3
      },
      {
        name: 'Routing & Notification Agent',
        description: 'Assigns owner in Pipedrive and sends Slack alerts',
        inputs: 'Scored deal with recommended owner',
        outputs: 'CRM record created, Slack notification sent',
        integrations: ['Pipedrive', 'Slack'],
        step_order: 4
      }
    ]
  },
  'meeting-prep': {
    name: 'Meeting Preparation',
    description: 'Generate meeting briefs with CRM history and external research',
    agents: [
      {
        name: 'Calendar Trigger Agent',
        description: 'Detects upcoming meetings from Google Calendar',
        inputs: 'Calendar events',
        outputs: 'Meeting details with participants',
        integrations: ['Google Calendar'],
        step_order: 1
      },
      {
        name: 'Brief Builder Agent',
        description: 'Generates comprehensive meeting preparation documents',
        inputs: 'Calendar event, CRM data, external research',
        outputs: 'Formatted meeting brief',
        integrations: ['Notion', 'Slack'],
        step_order: 2
      }
    ]
  },
  'crm-hygiene': {
    name: 'CRM Hygiene',
    description: 'Dedupe, fill missing fields, and maintain data quality',
    agents: [
      {
        name: 'Data Quality Agent',
        description: 'Identifies and fixes CRM data issues',
        inputs: 'CRM records',
        outputs: 'Suggested corrections',
        integrations: ['Pipedrive'],
        step_order: 1
      },
      {
        name: 'Approval Agent',
        description: 'Routes corrections for human approval',
        inputs: 'Suggested changes',
        outputs: 'Approved changes ready to execute',
        integrations: ['Slack'],
        step_order: 2
      }
    ]
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { command } = await req.json();
    
    if (!command) {
      return new Response(
        JSON.stringify({ error: 'Command is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Parsing command:', command);

    // Call Lovable AI to parse the command
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: `You are a VC workflow automation expert. Analyze user commands and classify them into one of these workflow types:
- dealflow-triage: Commands about capturing, enriching, scoring, or routing deals
- meeting-prep: Commands about preparing for meetings, briefing, or meeting research
- crm-hygiene: Commands about cleaning, deduping, or maintaining CRM data quality
- research-outbound: Commands about researching companies or outbound prospecting
- portfolio-lp: Commands about portfolio monitoring or LP reporting
- custom: If none of the above fit

Return ONLY a JSON object with: { "workflow_type": "type", "confidence": 0.0-1.0 }`
          },
          {
            role: 'user',
            content: command
          }
        ]
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to parse command' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    console.log('AI response:', aiContent);

    // Parse AI response
    let parsedResult;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = aiContent.match(/```json\s*(\{[\s\S]*?\})\s*```/) || 
                        aiContent.match(/(\{[\s\S]*?\})/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiContent;
      parsedResult = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      parsedResult = { workflow_type: 'custom', confidence: 0.5 };
    }

    const workflowType = parsedResult.workflow_type as string;
    const template = WORKFLOW_TEMPLATES[workflowType as keyof typeof WORKFLOW_TEMPLATES];

    if (!template) {
      return new Response(
        JSON.stringify({
          workflow_type: 'custom',
          name: 'Custom Workflow',
          description: command,
          agents: [],
          confidence: parsedResult.confidence || 0.5
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Matched template:', workflowType);

    return new Response(
      JSON.stringify({
        workflow_type: workflowType,
        ...template,
        confidence: parsedResult.confidence || 0.9
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in parse-workflow-command:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
    );
  }
});