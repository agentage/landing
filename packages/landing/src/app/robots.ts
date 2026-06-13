import type { MetadataRoute } from 'next';
import { environment } from '@agentage/shared';
import { getSiteUrl } from '../lib/site';

// Only the production deployment is indexable; the env is derived per request from the
// same runtime SITE_FQDN that drives the URLs below (one prod/dev signal, not APP_ENV).
export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const isProduction = environment(process.env.SITE_FQDN) === 'production';

  if (!isProduction) {
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
