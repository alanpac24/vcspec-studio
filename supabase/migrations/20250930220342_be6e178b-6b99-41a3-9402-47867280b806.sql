-- Create workflows table to store user-created workflows
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  workflow_type TEXT NOT NULL,
  agents JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agents table to store agent configurations
CREATE TABLE IF NOT EXISTS public.agent_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  inputs TEXT,
  outputs TEXT,
  integrations TEXT[] DEFAULT '{}',
  parameters JSONB DEFAULT '{}'::jsonb,
  step_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create runs table to track workflow executions
CREATE TABLE IF NOT EXISTS public.workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  agents_executed INTEGER DEFAULT 0,
  result JSONB
);

-- Enable RLS
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_runs ENABLE ROW LEVEL SECURITY;

-- Create policies (public access for now since we don't have auth)
CREATE POLICY "Allow all operations on workflows" ON public.workflows FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on agent_configs" ON public.agent_configs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on workflow_runs" ON public.workflow_runs FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to workflows
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON public.workflows
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();