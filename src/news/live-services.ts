export type FeedFetcher = (url: string, init?: RequestInit) => Promise<Response>;

interface FetchFeedOptions {
  maxBytes?: number;
  timeoutMs?: number;
}

export async function fetchFeedText(
  url: string,
  fetcher: FeedFetcher = fetch,
  { maxBytes = 1_000_000, timeoutMs = 8_000 }: FetchFeedOptions = {},
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetcher(url, {
      headers: { accept: "application/rss+xml, application/xml, text/xml;q=0.9" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const declaredLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
      throw new Error("Feed exceeds maximum size");
    }

    if (!response.body) return "";
    return await readBoundedText(response.body, maxBytes);
  } finally {
    clearTimeout(timeout);
  }
}

async function readBoundedText(stream: ReadableStream<Uint8Array>, maxBytes: number): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let result = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return result + decoder.decode();
      bytesRead += value.byteLength;
      if (bytesRead > maxBytes) throw new Error("Feed exceeds maximum size");
      result += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}
