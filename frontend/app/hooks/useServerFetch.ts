export function useServerFetch() {
  const URL =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_URL
      : "http://localhost:3210";

  interface ServerRequest extends Omit<RequestInit, "body"> {
    path: string;
    body?: any;
  }

  const $fetch = async ({
    path,
    method = "GET",
    headers,
    body,
    ...options // Support for signals, cache mode, etc.
  }: ServerRequest) => {
    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const requestBody =
      body && typeof body === "object" ? JSON.stringify(body) : body;

    const res = await fetch(`${URL}/api/${path}`, {
      method,
      credentials: "include",
      headers: {
        ...defaultHeaders,
        ...(headers as Record<string, string>),
      },
      body: requestBody,
      ...options,
    });

    return await res.json();
  };

  return { $fetch };
}
