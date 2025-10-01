-- Create table for storing connected Pipedream accounts
CREATE TABLE public.connected_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  app_name TEXT NOT NULL,
  account_id TEXT NOT NULL,
  account_name TEXT,
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, app_name, account_id)
);

-- Enable RLS
ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;

-- Users can view their own connected accounts
CREATE POLICY "Users can view own connected accounts"
ON public.connected_accounts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own connected accounts
CREATE POLICY "Users can insert own connected accounts"
ON public.connected_accounts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own connected accounts
CREATE POLICY "Users can delete own connected accounts"
ON public.connected_accounts
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_connected_accounts_user_id ON public.connected_accounts(user_id);
CREATE INDEX idx_connected_accounts_app_name ON public.connected_accounts(app_name);