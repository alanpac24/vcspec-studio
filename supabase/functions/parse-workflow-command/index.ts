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
  },
  'research-outbound': {
    name: 'Research & Outbound',
    description: 'Research companies by thesis, rank fit, draft outreach',
    agents: [
      {
        name: 'Company Research Agent',
        description: 'Finds companies matching investment thesis',
        inputs: 'Investment thesis, target criteria',
        outputs: 'List of potential companies with basic data',
        integrations: ['Crunchbase', 'LinkedIn', 'Web Search'],
        step_order: 1,
        ai_prompt: 'Research companies matching the investment criteria. Return JSON with: companies (array with company_name, website, description, funding_stage, why_match), total_found (number), search_queries_used (array). Focus on companies that align with the thesis.'
      },
      {
        name: 'Fit Ranking Agent',
        description: 'Scores and ranks companies by strategic fit',
        inputs: 'Company profiles',
        outputs: 'Ranked list with fit scores',
        integrations: ['Custom ML Model'],
        step_order: 2,
        ai_prompt: 'Score each company on strategic fit. Return JSON with: ranked_companies (array with company_name, fit_score 0-100, fit_reasoning, stage_match, market_match, team_match), top_3_picks (array), pass_list (companies below threshold). Prioritize strategic alignment.'
      },
      {
        name: 'Outreach Drafting Agent',
        description: 'Generates personalized outreach messages',
        inputs: 'Top-ranked companies',
        outputs: 'Draft emails with personalization',
        integrations: ['Gmail'],
        step_order: 3,
        ai_prompt: 'Draft personalized outreach emails for top companies. Return JSON with: emails (array with to_company, subject_line, email_body, personalization_notes), key_talking_points (array), follow_up_strategy. Make emails authentic and value-focused.'
      }
    ]
  },
  'portfolio-lp': {
    name: 'Portfolio & LP Ops',
    description: 'Collect updates, draft LP letters, flag risks',
    agents: [
      {
        name: 'Portfolio Data Collector',
        description: 'Gathers metrics and updates from portfolio companies',
        inputs: 'Portfolio company list',
        outputs: 'Aggregated performance data',
        integrations: ['Email', 'Notion', 'Airtable'],
        step_order: 1,
        ai_prompt: 'Collect and structure portfolio company updates. Return JSON with: companies (array with company_name, mrr, burn_rate, runway_months, headcount, key_metrics), red_flags (array), positive_developments (array), data_completeness (percentage). Flag missing critical data.'
      },
      {
        name: 'Risk Analysis Agent',
        description: 'Identifies portfolio companies at risk',
        inputs: 'Portfolio performance data',
        outputs: 'Risk assessment and alerts',
        integrations: ['Slack'],
        step_order: 2,
        ai_prompt: 'Analyze portfolio for risks. Return JSON with: high_risk_companies (array with company, risk_factors, severity_score, recommended_actions), runway_alerts (companies < 6mo), performance_concerns (array), overall_portfolio_health (score 0-100). Be conservative in risk assessment.'
      },
      {
        name: 'LP Letter Drafting Agent',
        description: 'Generates quarterly LP update letters',
        inputs: 'Portfolio data, fund performance',
        outputs: 'Draft LP letter',
        integrations: ['Notion', 'Email'],
        step_order: 3,
        ai_prompt: 'Draft quarterly LP update letter. Return JSON with: executive_summary, portfolio_highlights (array), new_investments (array), exits_or_markups (array), key_metrics_summary, market_commentary, next_quarter_outlook. Maintain professional, transparent tone.'
      }
    ]
  },
  'fundraising': {
    name: 'Fundraising / LP CRM',
    description: 'Manage LP relationships and fundraising activities',
    agents: [
      {
        name: 'LP Engagement Tracker',
        description: 'Monitors LP interactions and touchpoints',
        inputs: 'Email history, meeting notes, calendar',
        outputs: 'LP engagement scores',
        integrations: ['Gmail', 'Calendar', 'Pipedrive'],
        step_order: 1,
        ai_prompt: 'Track LP engagement levels. Return JSON with: lps (array with name, last_contact_date, total_interactions_90d, engagement_score 0-100, relationship_status, next_action), low_engagement_alerts (array), vip_lps_needing_attention (array). Prioritize relationship quality.'
      },
      {
        name: 'Fundraising Pipeline Agent',
        description: 'Manages fundraising pipeline and commitments',
        inputs: 'LP conversations, commitment status',
        outputs: 'Pipeline forecast',
        integrations: ['Pipedrive', 'Notion'],
        step_order: 2,
        ai_prompt: 'Analyze fundraising pipeline. Return JSON with: total_committed, soft_circles (amount and LP names), active_conversations (array), expected_close_date, commitment_by_lp_type (breakdown), confidence_adjusted_forecast. Track momentum and confidence levels.'
      },
      {
        name: 'LP Communication Agent',
        description: 'Drafts personalized LP updates',
        inputs: 'LP data, fund updates',
        outputs: 'Personalized messages',
        integrations: ['Email'],
        step_order: 3,
        ai_prompt: 'Create personalized LP communications. Return JSON with: messages (array with lp_name, message_type, content, personalization_elements), segmentation_strategy (how message varies by LP type), key_asks (if fundraising), tone (formal/casual based on relationship). Maintain authentic voice.'
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

    console.log('Generating bespoke workflow for command:', command);

    // Always generate a bespoke workflow using AI
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