import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/types';

interface ErrorHandlerOptions {
  showToast?: boolean;
  fallbackMessage?: string;
  onError?: (error: ApiError) => void;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: ApiError | Error | unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      fallbackMessage = 'An unexpected error occurred',
      onError
    } = options;

    let errorMessage: string;
    let errorCode: string | undefined;

    if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = error.message;
      if ('code' in error) {
        errorCode = error.code as string;
      }
    } else {
      errorMessage = fallbackMessage;
    }

    // Log error for debugging
    console.error('Error:', {
      message: errorMessage,
      code: errorCode,
      error
    });

    // Show toast notification
    if (showToast) {
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }

    // Call custom error handler
    if (onError && error && typeof error === 'object' && 'message' in error) {
      onError(error as ApiError);
    }
  }, [toast]);

  return { handleError };
};