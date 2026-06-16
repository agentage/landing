import { describe, expect, it } from 'vitest';
import { links, environment, isNoindexHost } from './origins.js';

describe('links', () => {
  it('derives the site origin from a prod apex', () => {
    expect(links('agentage.io').site).toBe('https://agentage.io');
  });

  it('tolerates a scheme / trailing slash on the input', () => {
    expect(links('https://agentage.io/').site).toBe('https://agentage.io');
  });

  it('falls back to localhost for local dev (empty / localhost)', () => {
    for (const v of [undefined, '', 'localhost', 'localhost:3000']) {
      expect(links(v).site).toBe('http://localhost:3000');
    }
  });
});

describe('environment', () => {
  it('maps the bare apex to production', () => {
    expect(environment('agentage.io')).toBe('production');
    expect(environment('https://agentage.io/')).toBe('production');
  });

  it('maps dev. and localhost / empty to development', () => {
    expect(environment('dev.agentage.io')).toBe('development');
    expect(environment('localhost:3000')).toBe('development');
    expect(environment('')).toBe('development');
    expect(environment(undefined)).toBe('development');
  });
});

describe('isNoindexHost', () => {
  it('noindexes only positively-identified non-prod hosts', () => {
    for (const v of ['localhost', 'localhost:3000', '127.0.0.1', 'dev.agentage.io']) {
      expect(isNoindexHost(v), v).toBe(true);
    }
  });

  it('fails open: an empty / unknown FQDN stays indexable (never silently de-indexes prod)', () => {
    for (const v of [undefined, '', 'agentage.io', 'https://agentage.io/', 'www.agentage.io']) {
      expect(isNoindexHost(v), String(v)).toBe(false);
    }
  });
});
