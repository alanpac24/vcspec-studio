import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  integrations: string[];
  integration_config: any;
  step_order: number;
  inputs: string;
  outputs: string;
  ai_prompt?: string;
}

interface AgentResult {
  agent_id: string;
  agent_name: string;
  status: 'success' | 'error' | 'skipped';
  output: any;
  error?: string;
  execution_time_ms: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { workflow_id, trigger_data = {} } = await req.json();
    
    if (!workflow_id) {
      return new Response(
        JSON.stringify({ error: 'workflow_id is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting workflow execution:', workflow_id);

    // Create a run record
    const { data: run, error: runError } = await supabase
      .from('workflow_runs')
      .insert({
        workflow_id,
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (runError) {
      console.error('Error creating run:', runError);
      throw runError;
    }

    console.log('Created run:', run.id);

    // Get workflow and agents
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflow_id)
      .single();

    if (workflowError) throw workflowError;

    const { data: agents, error: agentsError } = await supabase
      .from('agent_configs')
      .select('*')
      .eq('workflow_id', workflow_id)
      .order('step_order', { ascending: true });

    if (agentsError) throw agentsError;

    console.log(`Executing ${agents.length} agents for workflow: ${workflow.name}`);

    // Execute agents sequentially
    const agentResults: AgentResult[] = [];
    let pipelineData = trigger_data;

    for (const agent of agents as AgentConfig[]) {
      const startTime = Date.now();
      console.log(`Executing agent: ${agent.name} (Step ${agent.step_order})`);

      try {
        const result = await executeAgent(agent, pipelineData);
        const executionTime = Date.now() - startTime;

        agentResults.push({
          agent_id: agent.id,
          agent_name: agent.name,
          status: 'success',
          output: result,
          execution_time_ms: executionTime,
        });

        // Pass output to next agent
        pipelineData = { ...pipelineData, ...result };
        
        console.log(`Agent ${agent.name} completed in ${executionTime}ms`);
      } catch (error) {
        const executionTime = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        console.error(`Agent ${agent.name} failed:`, errorMessage);

        agentResults.push({
          agent_id: agent.id,
          agent_name: agent.name,
          status: 'error',
          output: null,
          error: errorMessage,
          execution_time_ms: executionTime,
        });

        // Stop execution on error
        break;
      }
    }

    // Determine final status
    const hasErrors = agentResults.some(r => r.status === 'error');
    const finalStatus = hasErrors ? 'failed' : 'success';

    // Update run record
    const { error: updateError } = await supabase
      .from('workflow_runs')
      .update({
        status: finalStatus,
        completed_at: new Date().toISOString(),
        agents_executed: agentResults.length,
        agent_results: agentResults,
        result: pipelineData,
      })
      .eq('id', run.id);

    if (updateError) {
      console.error('Error updating run:', updateError);
    }

    console.log(`Workflow execution completed: ${finalStatus}`);

    return new Response(
      JSON.stringify({
        run_id: run.id,
        status: finalStatus,
        agents_executed: agentResults.length,
        results: agentResults,
        final_output: pipelineData,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in execute-workflow:', error);
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

async function executeAgent(agent: AgentConfig, inputData: any): Promise<any> {
  console.log(`Executing agent: ${agent.name}`);
  console.log('Input data:', inputData);

  const pipedreamWebhook = agent.integration_config?.pipedream_webhook;
  const aiPrompt = agent.ai_prompt;
  
  // Case 1: AI + Pipedream - Fetch data then process with AI
  if (aiPrompt && pipedreamWebhook) {
    console.log('Executing AI agent with Pipedream data fetch');
    
    try {
      // Step 1: Fetch data from Pipedream
      console.log('Fetching data from Pipedream:', pipedreamWebhook);
      const webhookResponse = await fetch(pipedreamWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_name: agent.name,
          input_data: inputData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!webhookResponse.ok) {
        throw new Error(`Pipedream webhook failed: ${webhookResponse.status}`);
      }

      const fetchedData = await webhookResponse.json().catch(() => ({ 
        message: 'Data fetched successfully' 
      }));

      // Step 2: Process with AI
      console.log('Processing fetched data with AI');
      const aiResult = await callLovableAI(agent, { ...inputData, fetched_data: fetchedData });

      return {
        mode: 'ai_with_data',
        fetched_data: fetchedData,
        ai_output: aiResult,
        agent_output: `${agent.name} completed with AI + data fetch`,
      };
    } catch (error) {
      console.error('AI + Pipedream execution error:', error);
      throw error;
    }
  }
  
  // Case 2: AI only - Process with prompt
  if (aiPrompt) {
    console.log('Executing AI-only agent');
    try {
      const aiResult = await callLovableAI(agent, inputData);
      return {
        mode: 'ai_only',
        ai_output: aiResult,
        agent_output: `${agent.name} completed with AI`,
      };
    } catch (error) {
      console.error('AI execution error:', error);
      throw error;
    }
  }
  
  // Case 3: Pipedream only - Just fetch/trigger
  if (pipedreamWebhook) {
    console.log('Executing Pipedream-only agent');
    
    try {
      const response = await fetch(pipedreamWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_name: agent.name,
          agent_description: agent.description,
          input_data: inputData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Pipedream webhook failed: ${response.status}`);
      }

      const result = await response.json().catch(() => ({ 
        success: true, 
        message: 'Webhook triggered successfully' 
      }));

      return {
        mode: 'webhook_only',
        webhook_response: result,
        agent_output: `${agent.name} completed via Pipedream`,
      };
    } catch (error) {
      console.error('Pipedream webhook error:', error);
      throw new Error(`Failed to trigger Pipedream webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Case 4: No configuration - Simulate
  console.log('No configuration, simulating execution');
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  const mockOutput: any = {
    mode: 'simulated',
    agent_name: agent.name,
    execution_timestamp: new Date().toISOString(),
    simulated: true,
  };

  if (agent.name.includes('Capture')) {
    mockOutput.captured_items = 3;
    mockOutput.deals = [
      { company: 'Acme AI', source: 'Email', priority: 'high' },
      { company: 'Beta Corp', source: 'Form', priority: 'medium' },
    ];
  } else if (agent.name.includes('Enrichment')) {
    mockOutput.enriched_deals = inputData.deals?.map((deal: any) => ({
      ...deal,
      funding: '$2M',
      stage: 'Series A',
    }));
  } else if (agent.name.includes('Scoring')) {
    mockOutput.scores = inputData.enriched_deals?.map((deal: any) => ({
      ...deal,
      fit_score: Math.floor(Math.random() * 40) + 60,
    }));
  }

  return mockOutput;
}

async function callLovableAI(agent: AgentConfig, inputData: any): Promise<any> {
  const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!lovableApiKey) {
    throw new Error('LOVABLE_API_KEY not configured');
  }

  console.log('Calling Lovable AI with prompt:', agent.ai_prompt);

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: `You are ${agent.name}. ${agent.description}\n\nYour task: ${agent.ai_prompt}\n\nReturn structured JSON output that the next agent can use.`
        },
        {
          role: 'user',
          content: `Process this data:\n\n${JSON.stringify(inputData, null, 2)}`
        }
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Lovable AI error:', response.status, errorText);
    
    if (response.status === 429) {
      throw new Error('AI rate limit exceeded. Please try again later.');
    }
    if (response.status === 402) {
      throw new Error('AI credits exhausted. Please add credits to continue.');
    }
    throw new Error(`AI request failed: ${response.status}`);
  }

  const data = await response.json();
  const aiOutput = data.choices?.[0]?.message?.content;

  if (!aiOutput) {
    throw new Error('No output from AI');
  }

  // Try to parse as JSON, fall back to raw text
  try {
    return JSON.parse(aiOutput);
  } catch {
    return { ai_response: aiOutput };
  }
}
