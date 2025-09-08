export const get = async <T>(
  url: string,
  fetchFn?: typeof fetch,
  options?: RequestInit,
): Promise<T> => fetchAPI(fetchFn ?? fetch, "GET", url, undefined, options);

export const post = async <T>(
  url: string,
  body: Record<string, unknown>,
  fetchFn?: typeof fetch,
  options?: RequestInit,
): Promise<T> =>
  fetchAPI(fetchFn ?? fetch, "POST", url, body, {
    ...options,
    headers: { "Content-Type": "application/json" },
  });

export const fetchAPI = async <T>(
  fetchFn: typeof fetch,
  method: "GET" | "POST",
  url: string,
  body?: Record<string, unknown>,
  options?: RequestInit,
): Promise<T> => {
  const headers = {
    "Content-Type": "application/json",
    ...options?.headers,
  };
  const response = await fetchFn(url, {
    ...options,
    headers,
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`,
    );
  }
  const data = (await response.json()) as T;
  return data;
};
