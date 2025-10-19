import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosInstance from '../lib/axios';

interface UseFetchOptions<T = any> extends AxiosRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: T;
}

type AxiosRequestConfigInFetchData = AxiosRequestConfig & { param?: string };
interface UseFetchResult<T = any> {
  data: T | null;
  error: AxiosError | null;
  isLoading: boolean;
  refetch: () => void;
  fetchData: (overrideConfig?: AxiosRequestConfigInFetchData) => Promise<void>;
}
const defaultHeaders = {};
function useFetch<T = any>(
  url: string,
  options: UseFetchOptions = {},
  autoFetch: boolean = true
): UseFetchResult<T> {
  const {
    method = 'GET',
    headers = defaultHeaders,
    data: requestData = null,
  } = useMemo(() => options, []);

  const restOptions = useMemo(() => {
    const {
      headers: _h,
      method: _m,
      data: _d,
      params: _p,
      ...restOptions
    } = options;
    return restOptions;
  }, []);

  const params = useMemo(
    () => options?.params || {},
    [JSON.stringify(options.params)]
  );
  console.log(JSON.stringify(options.params), 'JSON.stringify(options.params)');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);
  const lastRequestIdRef = useRef(0);

  const fetchData = useCallback(
    async (overrideConfig: AxiosRequestConfigInFetchData = {}) => {
      const requestId = ++lastRequestIdRef.current;
      setIsLoading(true);
      setError(null);

      try {
        const response: AxiosResponse<T> = await axiosInstance({
          url: overrideConfig?.param ? `${url}/${overrideConfig.param}` : url,
          method,
          headers,
          ...(requestData ? { data: requestData } : {}),
          params,
          ...restOptions,
          ...overrideConfig,
        });

        if (requestId === lastRequestIdRef.current) {
          setData(response.data);
        }
      } catch (err: any) {
        console.log('qwe');
        if (!autoFetch) {
          console.log('throwing man');
          throw err;
        }
        if (requestId === lastRequestIdRef.current) {
          setError(err.response.data);
        }
      } finally {
        if (requestId === lastRequestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [url, method, headers, requestData, params]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, fetchCount, autoFetch]);

  const refetch = useCallback(() => {
    setData(null);
    setFetchCount((prev) => prev + 1);
  }, []);

  return { data, error, isLoading, refetch, fetchData };
}

export default useFetch;
