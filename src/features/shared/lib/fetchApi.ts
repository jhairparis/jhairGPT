import { ApiError } from "./ApiError";

interface ApiRequestData<T = unknown> {
  [key: string]: T;
}

type RequestOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
};

interface ApiReturn<T> {
  data: T;
  response: Response;
}

interface Api {
  get: <T>(url: string, options?: RequestOptions) => Promise<ApiReturn<T>>;
  post: <T>(
    url: string,
    data: ApiRequestData,
    options?: RequestOptions
  ) => Promise<ApiReturn<T>>;
  put: <T>(
    url: string,
    data: ApiRequestData,
    options?: RequestOptions
  ) => Promise<ApiReturn<T>>;
  delete: <T>(url: string, options?: RequestOptions) => Promise<ApiReturn<T>>;
}

const URL = process.env.NEXT_PUBLIC_URL;

const handleResponse = async <T>(response: Response): Promise<ApiReturn<T>> => {
  const data = await response.json().catch(() => null);

  return { data, response };
};

const fetchApi: Api = {
  get: async <T>(
    url: string,
    options?: RequestOptions
  ): Promise<ApiReturn<T>> => {
    try {
      const response = await fetch(`${URL}${url}`, options ?? {});

      if (!response.ok)
        throw new ApiError({
          message: response.statusText,
          messageDebug: `Error ${response.status} on ${url}: ${response.statusText}`,
          status: response.status,
        });

      return handleResponse<T>(response);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  post: async <T>(
    url: string,
    data: ApiRequestData,
    options?: RequestOptions
  ): Promise<ApiReturn<T>> => {
    try {
      const response = await fetch(`${URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        },
        body: JSON.stringify(data),
        ...options,
      });

      if (!response.ok)
        throw new ApiError({
          message: response.statusText,
          messageDebug: `Error ${response.status} on ${url}: ${response.statusText}`,
          status: response.status,
        });

      return handleResponse<T>(response);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  put: async <T>(
    url: string,
    data: ApiRequestData,
    options?: RequestOptions
  ): Promise<ApiReturn<T>> => {
    try {
      const response = await fetch(`${URL}${url}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        },
        body: JSON.stringify(data),
        ...options,
      });

      if (!response.ok)
        throw new ApiError({
          message: response.statusText,
          messageDebug: `Error ${response.status} on ${url}: ${response.statusText}`,
          status: response.status,
        });

      return handleResponse<T>(response);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  delete: async <T>(
    url: string,
    options?: RequestOptions
  ): Promise<ApiReturn<T>> => {
    try {
      const response = await fetch(`${URL}${url}`, {
        method: "DELETE",
        ...(options ?? {}),
      });

      if (!response.ok)
        throw new ApiError({
          message: response.statusText,
          messageDebug: `Error ${response.status} on ${url}: ${response.statusText}`,
          status: response.status,
        });

      return handleResponse<T>(response);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default fetchApi;
