import { links } from '@agentage/shared';

// Build-time origin for static metadata (canonical/OG/JSON-LD), inlined from the
// NEXT_PUBLIC_SITE_FQDN build arg (derived from SITE_FQDN). The browser can't read
// runtime env, so these are necessarily build-baked.
export const SITE_URL = links(process.env.NEXT_PUBLIC_SITE_FQDN).site;

// Runtime origin from SITE_FQDN so dynamic routes (robots/sitemap/llms) emit the
// correct URLs without a rebuild.
export function getSiteUrl(): string {
  return links(process.env.SITE_FQDN).site;
}

export const SITE_NAME = 'Agentage Memory';
export const SITE_TAGLINE = 'One memory. Every AI. Owned by you.';
export const GITHUB_URL = 'https://github.com/agentage';
export const CONTACT_EMAIL = 'support@agentage.io';
