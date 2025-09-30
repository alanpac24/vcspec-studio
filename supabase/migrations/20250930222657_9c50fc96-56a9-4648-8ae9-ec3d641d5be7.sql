-- Add ai_prompt field to agent_configs table
ALTER TABLE agent_configs 
ADD COLUMN IF NOT EXISTS ai_prompt text;