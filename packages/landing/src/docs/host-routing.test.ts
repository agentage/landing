import { describe, expect, it } from 'vitest';
import {
  apexDocsRedirectPath,
  docMdUrl,
  docUrl,
  docsHostRouting,
  docsRewritePath,
  isSharedPath,
} from './host-routing';

describe('docsHostRouting', () => {
  it('splits the apex and the docs host off one FQDN', () => {
    expect(docsHostRouting('agentage.io')).toEqual({
      apexHost: 'agentage.io',
      docsHost: 'docs.agentage.io',
    });
    expect(docsHostRouting('dev.agentage.io')?.docsHost).toBe('docs.dev.agentage.io');
  });

  it('is undefined locally so an unconfigured container never redirects', () => {
    for (const v of [undefined, '', 'localhost', 'localhost:3100', '127.0.0.1']) {
      expect(docsHostRouting(v), String(v)).toBeUndefined();
    }
  });
});

describe('isSharedPath', () => {
  it('treats framework, API and asset paths as host-agnostic', () => {
    for (const p of [
      '/_next/static/chunk.js',
      '/api/session',
      '/schemas/vaults.schema.json',
      '/.well-known/mcp-registry-auth',
      '/health',
      '/opengraph-image',
      '/twitter-image',
      '/robots.txt',
      '/sitemap.xml',
      '/llms.txt',
      '/favicon.ico',
      '/icon-192.png',
      '/manifest.webmanifest',
    ]) {
      expect(isSharedPath(p), p).toBe(true);
    }
  });

  it('leaves docs content (including .md mirrors) routable', () => {
    for (const p of ['/', '/docs', '/docs/rest-api', '/rest-api', '/rest-api.md', '/docs.md']) {
      expect(isSharedPath(p), p).toBe(false);
    }
  });
});

describe('docsRewritePath', () => {
  it('serves the docs tree at the docs-host root', () => {
    expect(docsRewritePath('/')).toBe('/docs');
    expect(docsRewritePath('/rest-api')).toBe('/docs/rest-api');
    expect(docsRewritePath('/rest-api.md')).toBe('/docs/rest-api.md');
  });

  it('never double-prefixes an already docs-scoped path', () => {
    for (const p of ['/docs', '/docs/rest-api', '/docs.md', '/docs-md/rest-api']) {
      expect(docsRewritePath(p), p).toBeUndefined();
    }
  });

  it('passes shared paths straight through', () => {
    expect(docsRewritePath('/_next/static/chunk.js')).toBeUndefined();
    expect(docsRewritePath('/robots.txt')).toBeUndefined();
  });
});

describe('apexDocsRedirectPath', () => {
  it('maps the apex docs URLs onto the docs host', () => {
    expect(apexDocsRedirectPath('/docs')).toBe('/');
    expect(apexDocsRedirectPath('/docs/rest-api')).toBe('/rest-api');
    expect(apexDocsRedirectPath('/docs/rest-api.md')).toBe('/rest-api.md');
    expect(apexDocsRedirectPath('/docs.md')).toBe('/docs.md');
  });

  it('leaves every non-docs apex path alone', () => {
    for (const p of ['/', '/blog', '/privacy', '/docs-md/rest-api', '/documentation']) {
      expect(apexDocsRedirectPath(p), p).toBeUndefined();
    }
  });
});

describe('docUrl / docMdUrl', () => {
  it('builds docs-host URLs with the index at the root', () => {
    expect(docUrl('https://docs.agentage.io', '')).toBe('https://docs.agentage.io');
    expect(docUrl('https://docs.agentage.io', 'rest-api')).toBe(
      'https://docs.agentage.io/rest-api'
    );
    expect(docMdUrl('https://docs.agentage.io', '')).toBe('https://docs.agentage.io/docs.md');
    expect(docMdUrl('https://docs.agentage.io', 'rest-api')).toBe(
      'https://docs.agentage.io/rest-api.md'
    );
  });

  it('keeps the local <site>/docs shape working unchanged', () => {
    expect(docUrl('http://localhost:3000/docs', '')).toBe('http://localhost:3000/docs');
    expect(docUrl('http://localhost:3000/docs', 'cli')).toBe('http://localhost:3000/docs/cli');
    expect(docMdUrl('http://localhost:3000/docs', '')).toBe('http://localhost:3000/docs.md');
    expect(docMdUrl('http://localhost:3000/docs', 'cli')).toBe('http://localhost:3000/docs/cli.md');
  });
});
