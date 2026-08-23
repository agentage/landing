/**
 * Derives the public site origin and environment from one input FQDN.
 *
 * Pure string logic, zero dependencies, no Node/Next APIs - safe in a server
 * component or a client bundle.
 */

export type Env = 'development' | 'production';

// Local-dev ports (localhost has no subdomains, so services split by port).
const SITE_PORT = 3000;
const API_PORT = 3001;
const DASHBOARD_PORT = 3002;

export interface Links {
  /** apex / landing origin — https://agentage.io */
  site: string;
  /** dashboard host — https://dashboard.agentage.io */
  dashboard: string;
  /** backend API base — https://api.agentage.io/api */
  api: string;
  /** docs base - https://docs.agentage.io (local dev has no subdomains: <site>/docs) */
  docs: string;
}

const normalize = (fqdn?: string): string =>
  (fqdn ?? '')
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '')
    .toLowerCase();

const isLocal = (host: string): boolean =>
  !host || host.startsWith('localhost') || host.startsWith('127.0.0.1');

/** Service origins from the FQDN; empty/localhost yields local-dev URLs. */
export const links = (siteFqdn?: string): Links => {
  const host = normalize(siteFqdn);
  if (isLocal(host)) {
    return {
      site: `http://localhost:${SITE_PORT}`,
      dashboard: `http://localhost:${DASHBOARD_PORT}`,
      api: `http://localhost:${API_PORT}/api`,
      docs: `http://localhost:${SITE_PORT}/docs`,
    };
  }
  return {
    site: `https://${host}`,
    dashboard: `https://dashboard.${host}`,
    api: `https://api.${host}/api`,
    docs: `https://docs.${host}`,
  };
};

/** Dedicated docs hostname, or undefined locally where docs stay under <site>/docs. */
export const docsHost = (siteFqdn?: string): string | undefined => {
  const host = normalize(siteFqdn);
  return isLocal(host) ? undefined : `docs.${host}`;
};

/** The bare apex is production; a `dev.` prefix or localhost is development. */
export const environment = (siteFqdn?: string): Env => {
  const host = normalize(siteFqdn);
  if (isLocal(host) || host.startsWith('dev.')) return 'development';
  return 'production';
};

/** robots noindex gate - fail-open: only localhost / a `dev.` host is de-indexed, never an empty/unknown FQDN, so a missing SITE_FQDN can't silently de-index prod. */
export const isNoindexHost = (siteFqdn?: string): boolean => {
  const host = normalize(siteFqdn);
  return host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('dev.');
};
