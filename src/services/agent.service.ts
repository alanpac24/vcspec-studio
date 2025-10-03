import { BaseService } from './base.service';
import { Agent, ApiResponse, PaginationParams, PaginatedResponse } from '@/types';
import { Database } from '@/types/database';

export class AgentService extends BaseService {
  async createAgent(
    agent: Database['public']['Tables']['agents']['Insert']
  ): Promise<ApiResponse<Agent>> {
    return this.execute(() =>
      this.supabase
        .from('agents')
        .insert(agent)
        .select()
        .single()
    );
  }

  async getAgent(agentId: string): Promise<ApiResponse<Agent>> {
    return this.execute(() =>
      this.supabase
        .from('agents')
        .select('*')
        .eq('id', agentId)
        .single()
    );
  }

  async getAgentByWorkflowType(workflowType: string): Promise<ApiResponse<Agent>> {
    return this.execute(() =>
      this.supabase
        .from('agents')
        .select('*')
        .eq('workflow_type', workflowType)
        .eq('is_active', true)
        .order('version', { ascending: false })
        .limit(1)
        .single()
    );
  }

  async getAgents(
    params?: PaginationParams & {
      workflowType?: string;
      isActive?: boolean;
    }
  ): Promise<ApiResponse<PaginatedResponse<Agent>>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
      workflowType,
      isActive
    } = params || {};

    // Get total count
    let countQuery = this.supabase
      .from('agents')
      .select('*', { count: 'exact', head: true });

    if (workflowType) countQuery = countQuery.eq('workflow_type', workflowType);
    if (isActive !== undefined) countQuery = countQuery.eq('is_active', isActive);

    const { count } = await countQuery;

    // Get paginated data
    let query = this.supabase
      .from('agents')
      .select('*')
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * limit, page * limit - 1);

    if (workflowType) query = query.eq('workflow_type', workflowType);
    if (isActive !== undefined) query = query.eq('is_active', isActive);

    const result = await this.execute(() => query);
    
    if (result.error) {
      return result;
    }

    return {
      data: {
        data: result.data || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };
  }

  async updateAgent(
    agentId: string,
    updates: Database['public']['Tables']['agents']['Update']
  ): Promise<ApiResponse<Agent>> {
    return this.execute(() =>
      this.supabase
        .from('agents')
        .update(updates)
        .eq('id', agentId)
        .select()
        .single()
    );
  }

  async deleteAgent(agentId: string): Promise<ApiResponse<void>> {
    const result = await this.execute(() =>
      this.supabase
        .from('agents')
        .delete()
        .eq('id', agentId)
    );

    return {
      data: result.data ? undefined : undefined,
      error: result.error
    };
  }

  async toggleAgentStatus(agentId: string): Promise<ApiResponse<Agent>> {
    // First get the current status
    const { data: agent, error: fetchError } = await this.getAgent(agentId);
    
    if (fetchError || !agent) {
      return { error: fetchError || { message: 'Agent not found', code: 'NOT_FOUND' } };
    }

    // Toggle the status
    return this.updateAgent(agentId, { is_active: !agent.is_active });
  }
}

export const agentService = new AgentService();