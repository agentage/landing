import { describe, expect, it } from 'vitest';
import {
  apexDocsRedirectPath,
  docMdUrl,
  docUrl,
  docsHostAction,
  docsHostRouting,
  isSharedPath,
  shortLinkDocSlug,
} from './host-routing';
import { docSlugs } from './registry';

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

describe('docsHostAction', () => {
  const SLUGS = ['rest-api', 'mcp-server', 'connect'];

  it('serves the docs tree at the docs-host root', () => {
    expect(docsHostAction('/', SLUGS)).toEqual({ kind: 'rewrite', pathname: '/docs' });
    expect(docsHostAction('/rest-api', SLUGS)).toEqual({
      kind: 'rewrite',
      pathname: '/docs/rest-api',
    });
    expect(docsHostAction('/rest-api.md', SLUGS)).toEqual({
      kind: 'rewrite',
      pathname: '/docs/rest-api.md',
    });
    expect(docsHostAction('/rest-api/', SLUGS)).toEqual({
      kind: 'rewrite',
      pathname: '/docs/rest-api',
    });
  });

  it('never double-prefixes an already docs-scoped path', () => {
    for (const p of ['/docs', '/docs/rest-api', '/docs.md', '/docs-md/rest-api']) {
      expect(docsHostAction(p, SLUGS), p).toEqual({ kind: 'serve' });
    }
  });

  it('passes shared paths straight through', () => {
    for (const p of ['/_next/static/chunk.js', '/robots.txt', '/sitemap.xml', '/health']) {
      expect(docsHostAction(p, SLUGS), p).toEqual({ kind: 'serve' });
    }
  });

  // The shared header/footer link to these with host-relative hrefs; without the
  // fallback they were rewritten into the docs tree and 404'd on the docs host.
  it('sends the apex pages linked from the shared header/footer back to the apex', () => {
    for (const p of ['/blog', '/contacts', '/privacy', '/terms']) {
      expect(docsHostAction(p, SLUGS), p).toEqual({ kind: 'apex', pathname: p });
    }
  });

  it('sends unknown paths to the apex, whose 404 page has working nav', () => {
    for (const p of ['/nope', '/blog/some-post', '/unsubscribe']) {
      expect(docsHostAction(p, SLUGS), p).toEqual({ kind: 'apex', pathname: p });
    }
  });

  it('keeps the path verbatim for the apex hand-off (query is added by the caller)', () => {
    expect(docsHostAction('/unsubscribe/', SLUGS)).toEqual({
      kind: 'apex',
      pathname: '/unsubscribe/',
    });
  });

  it('follows the registry: an unregistered slug is not docs content', () => {
    expect(docsHostAction('/rest-api', [])).toEqual({ kind: 'apex', pathname: '/rest-api' });
    expect(docsHostAction('/troubleshoot', [...SLUGS, 'troubleshoot'])).toEqual({
      kind: 'rewrite',
      pathname: '/docs/troubleshoot',
    });
  });

  // Against the real registry, so adding a doc page cannot silently start 308ing it.
  it('rewrites every registered doc and hands the apex pages back', () => {
    const real = docSlugs();
    expect(real.length).toBeGreaterThan(3);
    for (const slug of real) {
      expect(docsHostAction(`/${slug}`, real), slug).toEqual({
        kind: 'rewrite',
        pathname: `/docs/${slug}`,
      });
    }
    for (const p of ['/blog', '/contacts', '/privacy', '/terms']) {
      expect(docsHostAction(p, real), p).toEqual({ kind: 'apex', pathname: p });
    }
  });
});

describe('shortLinkDocSlug', () => {
  it('resolves /connect to the connect doc, trailing slash included', () => {
    expect(shortLinkDocSlug('/connect')).toBe('connect');
    expect(shortLinkDocSlug('/connect/')).toBe('connect');
  });

  it('is undefined for everything else', () => {
    for (const p of ['/', '/connects', '/docs/connect', '/blog', '/connect.md']) {
      expect(shortLinkDocSlug(p), p).toBeUndefined();
    }
  });

  // The apex sends /connect to the docs host; on the docs host it is a plain doc
  // slug, so it serves directly instead of taking a second hop.
  it('names a slug the docs host serves without a redirect', () => {
    const slug = shortLinkDocSlug('/connect')!;
    expect(docSlugs()).toContain(slug);
    expect(docsHostAction(`/${slug}`, docSlugs())).toEqual({
      kind: 'rewrite',
      pathname: `/docs/${slug}`,
    });
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
