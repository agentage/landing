/**
 * Derives the public site origin and environment from one input FQDN.
 *
 * Pure string logic, zero dependencies, no Node/Next APIs - safe in a server
 * component or a client bundle.
 */

export type Env = 'development' | 'production';

const SITE_PORT = 3000;

export interface Links {
  /** apex / landing origin */
  site: string;
}

const normalize = (fqdn?: string): string =>
  (fqdn ?? '')
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '')
    .toLowerCase();

const isLocal = (host: string): boolean =>
  !host || host.startsWith('localhost') || host.startsWith('127.0.0.1');

/** Site origin from the FQDN; empty/localhost yields the local-dev URL. */
export const links = (siteFqdn?: string): Links => {
  const host = normalize(siteFqdn);
  return { site: isLocal(host) ? `http://localhost:${SITE_PORT}` : `https://${host}` };
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
