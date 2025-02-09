interface ApiRequestData<T = unknown> {
  [key: string]: T;
}

type RequestOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
  timeout?: number;
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

const fetchWithTimeout = async (
  url: string,
  options: RequestOptions,
  timeout: number
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(url, { ...options, signal: controller.signal });
  clearTimeout(id);
  return response;
};

const handleResponse = async <T>(response: Response): Promise<ApiReturn<T>> => {
  if (!response.ok) {
    Promise.reject(`Error ${response.status}: ${response.statusText}`);
  }
  const data = await response.json().catch(() => null);
  return { data, response };
};

const logError = (error: unknown): void => {
  if (process.env.NODE_ENV !== "production") {
    console.error("API Error:", error);
  }
};

const fetchApi: Api = {
  get: async <T>(
    url: string,
    options?: RequestOptions
  ): Promise<ApiReturn<T>> => {
    try {
      const timeout = options?.timeout || 5000;
      const response = await fetchWithTimeout(
        `${URL}${url}`,
        options ?? {},
        timeout
      );
      return handleResponse<T>(response);
    } catch (error) {
      logError(error);
      throw error;
    }
  },
  post: async <T>(
    url: string,
    data: ApiRequestData,
    options?: RequestOptions
  ): Promise<ApiReturn<T>> => {
    try {
      const timeout = options?.timeout || 5000;
      const response = await fetchWithTimeout(
        `${URL}${url}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(options?.headers || {}),
          },
          body: JSON.stringify(data),
          ...options,
        },
        timeout
      );
      return handleResponse<T>(response);
    } catch (error) {
      logError(error);
      throw error;
    }
  },
  put: async <T>(
    url: string,
    data: ApiRequestData,
    options?: RequestOptions
  ): Promise<ApiReturn<T>> => {
    try {
      const timeout = options?.timeout || 5000;
      const response = await fetchWithTimeout(
        `${URL}${url}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(options?.headers || {}),
          },
          body: JSON.stringify(data),
          ...options,
        },
        timeout
      );
      return handleResponse<T>(response);
    } catch (error) {
      logError(error);
      throw error;
    }
  },
  delete: async <T>(
    url: string,
    options?: RequestOptions
  ): Promise<ApiReturn<T>> => {
    try {
      const timeout = options?.timeout || 5000;
      const response = await fetchWithTimeout(
        `${URL}${url}`,
        { method: "DELETE", ...(options ?? {}) },
        timeout
      );
      return handleResponse<T>(response);
    } catch (error) {
      logError(error);
      throw error;
    }
  },
};

export default fetchApi;
