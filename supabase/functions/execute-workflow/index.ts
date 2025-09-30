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

  // Check for Zapier webhook
  const zapierWebhook = agent.integration_config?.zapier_webhook;
  
  if (zapierWebhook) {
    console.log('Triggering Zapier webhook:', zapierWebhook);
    
    try {
      const response = await fetch(zapierWebhook, {
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
        throw new Error(`Zapier webhook failed: ${response.status}`);
      }

      const result = await response.json().catch(() => ({ 
        success: true, 
        message: 'Webhook triggered successfully' 
      }));

      return {
        webhook_triggered: true,
        webhook_response: result,
        agent_output: `${agent.name} completed via Zapier`,
      };
    } catch (error) {
      console.error('Zapier webhook error:', error);
      throw new Error(`Failed to trigger Zapier webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Simulated execution for agents without integrations
  console.log('No webhook configured, simulating execution');
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  // Generate mock output based on agent type
  const mockOutput: any = {
    agent_name: agent.name,
    execution_timestamp: new Date().toISOString(),
    simulated: true,
  };

  // Add agent-specific mock data
  if (agent.name.includes('Capture')) {
    mockOutput.captured_items = 3;
    mockOutput.sources = ['Email', 'Form', 'LinkedIn'];
    mockOutput.deals = [
      { company: 'Acme AI', source: 'Email', priority: 'high' },
      { company: 'Beta Corp', source: 'Form', priority: 'medium' },
      { company: 'Gamma Tech', source: 'LinkedIn', priority: 'low' },
    ];
  } else if (agent.name.includes('Enrichment')) {
    mockOutput.enriched_count = inputData.deals?.length || 3;
    mockOutput.data_sources = agent.integrations;
    mockOutput.enriched_deals = inputData.deals?.map((deal: any) => ({
      ...deal,
      funding: '$2M',
      stage: 'Series A',
      employees: '15-50',
      founded: '2022',
    }));
  } else if (agent.name.includes('Scoring')) {
    mockOutput.scored_count = inputData.enriched_deals?.length || 3;
    mockOutput.scores = inputData.enriched_deals?.map((deal: any) => ({
      ...deal,
      fit_score: Math.floor(Math.random() * 40) + 60,
      reasons: ['Strong founder', 'Good traction', 'Right stage'],
    }));
  } else if (agent.name.includes('Routing') || agent.name.includes('Notification')) {
    mockOutput.notified = true;
    mockOutput.channels = agent.integrations;
    mockOutput.recipients = ['team@vc.com'];
    mockOutput.crm_updated = true;
  } else if (agent.name.includes('Brief')) {
    mockOutput.brief_generated = true;
    mockOutput.sections = ['Company Overview', 'Recent Activity', 'Talking Points'];
  } else if (agent.name.includes('Quality')) {
    mockOutput.issues_found = 5;
    mockOutput.fixes_suggested = ['Dedupe 2 contacts', 'Fill 3 missing fields'];
  }

  return mockOutput;
}
