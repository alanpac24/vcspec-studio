import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, ApiError } from '@/types';

export abstract class BaseService {
  protected async handleError(error: any): Promise<ApiError> {
    console.error('API Error:', error);
    
    if (error.code === 'PGRST116') {
      return {
        message: 'Resource not found',
        code: 'NOT_FOUND',
        statusCode: 404
      };
    }
    
    if (error.code === '23505') {
      return {
        message: 'Resource already exists',
        code: 'DUPLICATE',
        statusCode: 409
      };
    }
    
    return {
      message: error.message || 'An unexpected error occurred',
      code: error.code || 'UNKNOWN',
      statusCode: error.status || 500
    };
  }
  
  protected async execute<T>(
    operation: () => Promise<{ data: T | null; error: any }>
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await operation();
      
      if (error) {
        return {
          error: await this.handleError(error)
        };
      }
      
      return { data: data as T };
    } catch (error) {
      return {
        error: await this.handleError(error)
      };
    }
  }
  
  protected get supabase() {
    return supabase;
  }
}