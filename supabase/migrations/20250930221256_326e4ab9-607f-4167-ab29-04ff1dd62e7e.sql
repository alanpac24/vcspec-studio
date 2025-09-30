-- Add integration_config column to store Zapier webhooks and API configs
ALTER TABLE public.agent_configs 
ADD COLUMN IF NOT EXISTS integration_config JSONB DEFAULT '{}'::jsonb;

-- Update workflow_runs table to store detailed execution data
ALTER TABLE public.workflow_runs 
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS agent_results JSONB DEFAULT '[]'::jsonb;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_workflow_runs_workflow_id ON public.workflow_runs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON public.workflow_runs(status);