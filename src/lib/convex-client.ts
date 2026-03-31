import { ConvexHttpClient } from 'convex/browser';

let client: ConvexHttpClient | null = null;

export function getConvexClient(): ConvexHttpClient {
  if (client) return client;

  const importMetaEnv = (import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  }).env;

  const convexUrl =
    process.env.CONVEX_URL?.trim() ||
    process.env.PUBLIC_CONVEX_URL?.trim() ||
    importMetaEnv?.CONVEX_URL?.trim() ||
    importMetaEnv?.PUBLIC_CONVEX_URL?.trim();

  if (!convexUrl) {
    throw new Error('Missing CONVEX_URL');
  }

  client = new ConvexHttpClient(convexUrl);
  return client;
}
