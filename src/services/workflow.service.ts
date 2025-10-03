import { BaseService } from './base.service';
import { WorkflowRun, WorkflowInput, ApiResponse, PaginationParams, PaginatedResponse } from '@/types';
import { Database } from '@/types/database';

export class WorkflowService extends BaseService {
  async createRun(
    workflowType: string,
    input: WorkflowInput,
    userId?: string
  ): Promise<ApiResponse<WorkflowRun>> {
    return this.execute(() =>
      this.supabase
        .from('runs')
        .insert({
          workflow_type: workflowType,
          status: 'pending',
          input,
          user_id: userId
        })
        .select()
        .single()
    );
  }

  async getRun(runId: string): Promise<ApiResponse<WorkflowRun>> {
    return this.execute(() =>
      this.supabase
        .from('runs')
        .select('*')
        .eq('id', runId)
        .single()
    );
  }

  async getRuns(
    params?: PaginationParams & { 
      workflowType?: string; 
      userId?: string;
      status?: WorkflowRun['status'];
    }
  ): Promise<ApiResponse<PaginatedResponse<WorkflowRun>>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
      workflowType,
      userId,
      status
    } = params || {};

    // Get total count
    let countQuery = this.supabase
      .from('runs')
      .select('*', { count: 'exact', head: true });

    if (workflowType) countQuery = countQuery.eq('workflow_type', workflowType);
    if (userId) countQuery = countQuery.eq('user_id', userId);
    if (status) countQuery = countQuery.eq('status', status);

    const { count } = await countQuery;

    // Get paginated data
    let query = this.supabase
      .from('runs')
      .select('*')
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * limit, page * limit - 1);

    if (workflowType) query = query.eq('workflow_type', workflowType);
    if (userId) query = query.eq('user_id', userId);
    if (status) query = query.eq('status', status);

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

  async updateRun(
    runId: string,
    updates: Partial<Database['public']['Tables']['runs']['Update']>
  ): Promise<ApiResponse<WorkflowRun>> {
    return this.execute(() =>
      this.supabase
        .from('runs')
        .update(updates)
        .eq('id', runId)
        .select()
        .single()
    );
  }

  async deleteRun(runId: string): Promise<ApiResponse<void>> {
    const result = await this.execute(() =>
      this.supabase
        .from('runs')
        .delete()
        .eq('id', runId)
    );

    return {
      data: result.data ? undefined : undefined,
      error: result.error
    };
  }
}

export const workflowService = new WorkflowService();