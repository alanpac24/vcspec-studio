-- Drop trigger first, then function, then recreate both with proper security
DROP TRIGGER IF EXISTS update_workflows_updated_at ON public.workflows;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Recreate function with proper search_path for security
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_workflows_updated_at 
BEFORE UPDATE ON public.workflows
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();