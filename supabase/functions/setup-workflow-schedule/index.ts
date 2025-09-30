import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { workflow_id, cron_expression } = await req.json();

    if (!workflow_id || !cron_expression) {
      return new Response(
        JSON.stringify({ error: 'workflow_id and cron_expression are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Setting up schedule for workflow:', workflow_id);
    console.log('Cron expression:', cron_expression);

    // Remove existing schedule if it exists (ignore errors)
    try {
      await supabase.rpc('cron_unschedule', {
        job_name: `workflow_${workflow_id}`,
      });
    } catch (err) {
      console.log('No existing schedule to remove');
    }

    // Create new schedule
    const { data, error } = await supabase.rpc('cron_schedule', {
      job_name: `workflow_${workflow_id}`,
      schedule: cron_expression,
      command: `
        SELECT net.http_post(
          url := '${supabaseUrl}/functions/v1/execute-workflow',
          headers := '{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseServiceKey}"}'::jsonb,
          body := '{"workflow_id": "${workflow_id}", "trigger_data": {"triggered_by": "schedule", "timestamp": "' || now()::text || '"}}'::jsonb
        );
      `,
    });

    if (error) {
      console.error('Error scheduling workflow:', error);
      throw error;
    }

    console.log('Schedule created successfully');

    return new Response(
      JSON.stringify({
        success: true,
        job_name: `workflow_${workflow_id}`,
        schedule: cron_expression,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in setup-workflow-schedule:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
