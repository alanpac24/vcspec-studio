-- Add scheduling fields to workflows table
ALTER TABLE workflows 
ADD COLUMN IF NOT EXISTS schedule_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS schedule_cron text,
ADD COLUMN IF NOT EXISTS trigger_type text DEFAULT 'manual';

-- Add comment for clarity
COMMENT ON COLUMN workflows.trigger_type IS 'manual, scheduled, webhook, or event';
COMMENT ON COLUMN workflows.schedule_cron IS 'Cron expression for scheduled workflows (e.g., "0 9 * * 1" for every Monday at 9am)';

-- Enable pg_cron extension for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;