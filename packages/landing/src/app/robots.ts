import type { MetadataRoute } from 'next';
import { isNoindexHost } from '@agentage/shared';
import { getSiteUrl } from '../lib/site';

// Indexable by default; only a positively-identified non-prod host (localhost / dev.) is
// de-indexed. Fail-open so a missing runtime SITE_FQDN can't silently de-index prod.
export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (isNoindexHost(process.env.SITE_FQDN)) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  const host = getSiteUrl();

  // Explicitly welcome the major AI crawlers - a named opt-in for an AI-memory product.
  const AI_BOTS = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'anthropic-ai',
    'Claude-User',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot-Extended',
    'CCBot',
  ];
  const disallow = ['/api/', '/dashboard/'];

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: '/', disallow })),
    ],
    sitemap: `${host}/sitemap.xml`,
  };
}
