-- Add name column to workflows table
ALTER TABLE public.workflows ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT 'Unnamed Workflow';