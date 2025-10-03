export interface Workflow {
  type: string;
  title: string;
  description: string;
  emoji: string;
  path: string;
}

export interface WorkflowCategory {
  title: string;
  workflows: Workflow[];
}

export interface WorkflowPageProps {
  workflowType: string;
  title: string;
  description: string;
  exampleCommand: string;
}

export interface WorkflowRun {
  id: string;
  workflow_type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input?: any;
  output?: any;
  error?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface Agent {
  id: string;
  workflow_type: string;
  version: string;
  title: string;
  description: string;
  system_prompt?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowInput {
  [key: string]: any;
}

export interface WorkflowOutput {
  [key: string]: any;
}

export interface WorkflowError {
  message: string;
  code?: string;
  details?: any;
}