import { useState, useCallback } from 'react';
import { ApiError } from '@/types/api.types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

/**
 * Custom hook for API calls with loading, error, and data states
 */
export function useApi<T = any>(options?: UseApiOptions) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (apiCall: () => Promise<any>) => {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await apiCall();
        const data = response.data;

        setState({ data, loading: false, error: null });

        if (options?.onSuccess) {
          options.onSuccess(data);
        }

        return data;
      } catch (error: any) {
        const apiError: ApiError = {
          success: false,
          message: error.message || 'An error occurred',
          errors: error.errors,
          statusCode: error.statusCode || 500,
        };

        setState({ data: null, loading: false, error: apiError });

        if (options?.onError) {
          options.onError(apiError);
        }

        throw apiError;
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
