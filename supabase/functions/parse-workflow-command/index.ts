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
        step_order: 1,
        ai_prompt: 'Extract deal information from input data. Return JSON with: company_name, founder_name, source (email/form/linkedin), email_content, priority (high/medium/low). Analyze the content to determine if this is a serious investment opportunity.'
      },
      {
        name: 'Enrichment Agent',
        description: 'Pulls external data on company, founders, traction, funding',
        inputs: 'Company domain or name',
        outputs: 'Enriched profile with metrics, team, investors, news',
        integrations: ['Crunchbase', 'PitchBook', 'Dealroom'],
        step_order: 2,
        ai_prompt: 'Use the fetched company data to create an enriched profile. Return JSON with: company_overview, funding_rounds (array), team_size, key_metrics (MRR, ARR, growth_rate), investors (array), recent_news (array). Focus on investment-relevant metrics.'
      },
      {
        name: 'Scoring Agent',
        description: 'Scores deals based on stage, sector, traction, founder fit',
        inputs: 'Enriched company profile',
        outputs: 'Fit score (0-100) and priority ranking',
        integrations: ['Custom ML Model'],
        step_order: 3,
        ai_prompt: 'Analyze the enriched company data and score it 0-100 based on: stage fit (30%), traction (25%), team quality (25%), market opportunity (20%). Return JSON with: overall_score, stage_score, traction_score, team_score, market_score, recommendation (pass/meet/invest), reasoning (string explaining the score).'
      },
      {
        name: 'Routing & Notification Agent',
        description: 'Assigns owner in Pipedrive and sends Slack alerts',
        inputs: 'Scored deal with recommended owner',
        outputs: 'CRM record created, Slack notification sent',
        integrations: ['Pipedrive', 'Slack'],
        step_order: 4,
        ai_prompt: 'Based on the deal score and data, prepare notification content. Return JSON with: assigned_partner (name), notification_message (string for Slack), deal_summary (3-5 key bullet points), urgency (low/medium/high), next_action (recommended next step).'
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
        step_order: 1,
        ai_prompt: 'Extract meeting details from calendar data. Return JSON with: meeting_title, participants (array), meeting_time, duration_minutes, company_names (array extracted from meeting details), meeting_type (intro/followup/diligence).'
      },
      {
        name: 'Brief Builder Agent',
        description: 'Generates comprehensive meeting preparation documents',
        inputs: 'Calendar event, CRM data, external research',
        outputs: 'Formatted meeting brief',
        integrations: ['Notion', 'Slack'],
        step_order: 2,
        ai_prompt: 'Create a comprehensive meeting brief. Return JSON with: executive_summary, company_background, last_interaction_summary, key_talking_points (array of 5-7 items), questions_to_ask (array), potential_concerns (array), recommended_approach. Make it concise but actionable.'
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
        step_order: 1,
        ai_prompt: 'Analyze CRM records for data quality issues. Return JSON with: duplicates (array of duplicate pairs with confidence scores), missing_fields (array with record_id and missing_field_names), incorrect_formats (array), suggested_fixes (array with record_id, field, current_value, suggested_value, reasoning).'
      },
      {
        name: 'Approval Agent',
        description: 'Routes corrections for human approval',
        inputs: 'Suggested changes',
        outputs: 'Approved changes ready to execute',
        integrations: ['Slack'],
        step_order: 2,
        ai_prompt: 'Format the suggested changes for human review. Return JSON with: high_confidence_changes (array - safe to auto-apply), review_required (array - need approval), notification_message (formatted text for Slack), total_issues_found (number).'
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

    // If no template match, use AI to generate custom workflow
    if (!template) {
      console.log('No template found, generating custom workflow with AI');
      
      const customWorkflowResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
              content: `You are a workflow automation expert. Given a user's request, design a multi-step workflow with 2-4 agents.

For each agent, provide:
- name: Clear, action-oriented name (e.g., "News Fetcher Agent")
- description: What this agent does
- inputs: What data it receives
- outputs: What data it produces
- integrations: Array of tools needed (e.g., ["Gmail", "Slack", "RSS Feeds", "Pipedrive"])
- ai_prompt: Detailed instructions for AI on what to do with the data
- step_order: 1, 2, 3, etc.

Return ONLY valid JSON:
{
  "name": "Workflow Name",
  "description": "Brief description",
  "agents": [array of agents]
}`
            },
            {
              role: 'user',
              content: `Create a workflow for: ${command}`
            }
          ]
        })
      });

      if (!customWorkflowResponse.ok) {
        console.error('Failed to generate custom workflow');
        return new Response(
          JSON.stringify({ error: 'Failed to generate workflow' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const customData = await customWorkflowResponse.json();
      const customContent = customData.choices[0].message.content;
      console.log('AI generated workflow:', customContent);

      let customWorkflow;
      try {
        // Try to extract JSON from markdown code blocks or raw JSON
        const jsonMatch = customContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                          customContent.match(/```\s*([\s\S]*?)\s*```/) ||
                          customContent.match(/(\{[\s\S]*\})/);
        const jsonStr = jsonMatch ? jsonMatch[1].trim() : customContent.trim();
        customWorkflow = JSON.parse(jsonStr);
        
        // Validate and ensure agents have required fields
        if (!customWorkflow.agents || customWorkflow.agents.length === 0) {
          throw new Error('No agents generated');
        }

        // Ensure each agent has required fields
        customWorkflow.agents = customWorkflow.agents.map((agent: any, idx: number) => ({
          name: agent.name || `Agent ${idx + 1}`,
          description: agent.description || 'Automated agent',
          inputs: agent.inputs || 'Data from previous step',
          outputs: agent.outputs || 'Processed data',
          integrations: Array.isArray(agent.integrations) ? agent.integrations : [],
          ai_prompt: agent.ai_prompt || `Process the input data for step ${idx + 1}`,
          step_order: agent.step_order || idx + 1,
        }));

        console.log('Parsed custom workflow:', customWorkflow);

      } catch (e) {
        console.error('Failed to parse custom workflow:', e);
        console.error('Raw AI response:', customContent);
        
        // Fallback: Create a basic workflow
        customWorkflow = {
          name: 'Custom Workflow',
          description: command,
          agents: [
            {
              name: 'Data Processing Agent',
              description: 'Processes input data according to your requirements',
              inputs: 'Trigger data',
              outputs: 'Processed results',
              integrations: ['Pipedream'],
              ai_prompt: `Based on this request: "${command}", analyze and process the input data appropriately. Return structured JSON output.`,
              step_order: 1,
            }
          ]
        };
      }

      return new Response(
        JSON.stringify({
          workflow_type: 'custom',
          name: customWorkflow.name || 'Custom Workflow',
          description: customWorkflow.description || command,
          agents: customWorkflow.agents || [],
          confidence: 0.8
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