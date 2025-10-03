export interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string;
          workflow_type: string;
          version: string;
          title: string;
          description: string;
          system_prompt: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['agents']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['agents']['Insert']>;
      };
      runs: {
        Row: {
          id: string;
          workflow_type: string;
          status: 'pending' | 'running' | 'completed' | 'failed';
          input: any;
          output: any;
          error: string | null;
          created_at: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: Omit<Database['public']['Tables']['runs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['runs']['Insert']>;
      };
    };
  };
}