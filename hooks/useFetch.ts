import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '@/types/api.types';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseFetchOptions {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

/**
 * Custom hook for fetching data on component mount with refetch capability
 */
export function useFetch<T = any>(
  fetchFn: () => Promise<any>,
  options?: UseFetchOptions
) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const { enabled = true, onSuccess, onError } = options || {};

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetchFn();
      const data = response.data;

      setState({ data, loading: false, error: null });

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error: any) {
      const apiError: ApiError = {
        success: false,
        message: error.message || 'An error occurred',
        errors: error.errors,
        statusCode: error.statusCode || 500,
      };

      setState({ data: null, loading: false, error: apiError });

      if (onError) {
        onError(apiError);
      }
    }
  }, [fetchFn, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch,
  };
}
