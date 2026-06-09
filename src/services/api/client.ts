export class ApiError<T = unknown> extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly data: T | null;

  constructor(status: number, statusText: string, data: T | null) {
    super(`HTTP ${status} ${statusText}: ${data ? JSON.stringify(data) : ""}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

export async function customFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { ...options, headers });

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  let data: any = null;
  if (response.status !== 204 && response.status !== 205 && response.status !== 304) {
    if (isJson) {
      data = await response.json().catch(() => null);
    } else {
      data = await response.text().catch(() => null);
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText, data);
  }

  return data as T;
}
