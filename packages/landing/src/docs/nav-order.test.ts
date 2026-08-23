import { describe, expect, it } from 'vitest';
import { docHref, docMdHref, flattenNav, navEntryFor, prevNext } from './nav-order';
import type { DocNavGroup } from './types';

const FIXTURE: DocNavGroup[] = [
  {
    title: 'Get started',
    items: [
      { label: 'Overview', slug: '' },
      { label: 'MCP server', slug: 'mcp-server' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { label: 'REST API', slug: 'rest-api' },
      { label: 'CLI', slug: 'cli', comingSoon: true },
      { label: 'Stub' },
    ],
  },
];

const NESTED: DocNavGroup[] = [
  {
    title: 'Memory',
    items: [
      {
        label: 'Connect a client',
        slug: 'connect',
        items: [
          { label: 'Claude Code', slug: 'claude-code' },
          { label: 'Cursor', slug: 'cursor' },
        ],
      },
      { label: 'MCP tools', slug: 'mcp-tools' },
    ],
  },
  {
    title: 'Resources',
    items: [{ label: 'Troubleshoot', comingSoon: true, items: [{ label: 'Nested stub' }] }],
  },
];

describe('flattenNav', () => {
  it('flattens groups into reading order and drops stubs', () => {
    expect(flattenNav(FIXTURE)).toEqual([
      { label: 'Overview', slug: '', groupTitle: 'Get started' },
      { label: 'MCP server', slug: 'mcp-server', groupTitle: 'Get started' },
      { label: 'REST API', slug: 'rest-api', groupTitle: 'Reference' },
    ]);
  });

  it('skips comingSoon and slug-less items', () => {
    const slugs = flattenNav(FIXTURE).map((e) => e.slug);
    expect(slugs).not.toContain('cli');
    expect(flattenNav(FIXTURE)).toHaveLength(3);
  });

  it('reads a nested item straight after its parent, under the group title', () => {
    expect(flattenNav(NESTED)).toEqual([
      { label: 'Connect a client', slug: 'connect', groupTitle: 'Memory' },
      { label: 'Claude Code', slug: 'claude-code', groupTitle: 'Memory' },
      { label: 'Cursor', slug: 'cursor', groupTitle: 'Memory' },
      { label: 'MCP tools', slug: 'mcp-tools', groupTitle: 'Memory' },
    ]);
  });
});

describe('prevNext', () => {
  it('returns no prev for the first entry', () => {
    expect(prevNext('', FIXTURE)).toEqual({
      next: { label: 'MCP server', slug: 'mcp-server', groupTitle: 'Get started' },
    });
  });

  it('returns both neighbours for a middle entry, spanning groups', () => {
    expect(prevNext('mcp-server', FIXTURE)).toEqual({
      prev: { label: 'Overview', slug: '', groupTitle: 'Get started' },
      next: { label: 'REST API', slug: 'rest-api', groupTitle: 'Reference' },
    });
  });

  it('returns no next for the last live entry', () => {
    expect(prevNext('rest-api', FIXTURE)).toEqual({
      prev: { label: 'MCP server', slug: 'mcp-server', groupTitle: 'Get started' },
    });
  });

  it('returns empty for an unknown or skipped slug', () => {
    expect(prevNext('nope', FIXTURE)).toEqual({});
    expect(prevNext('cli', FIXTURE)).toEqual({});
  });

  it('paginates from a nested leaf back to its parent and on to the next item', () => {
    expect(prevNext('cursor', NESTED)).toEqual({
      prev: { label: 'Claude Code', slug: 'claude-code', groupTitle: 'Memory' },
      next: { label: 'MCP tools', slug: 'mcp-tools', groupTitle: 'Memory' },
    });
  });
});

describe('navEntryFor', () => {
  it('returns the entry with its group title', () => {
    expect(navEntryFor('rest-api', FIXTURE)).toEqual({
      label: 'REST API',
      slug: 'rest-api',
      groupTitle: 'Reference',
    });
  });

  it('returns undefined for a skipped entry', () => {
    expect(navEntryFor('cli', FIXTURE)).toBeUndefined();
  });

  it('gives a nested page its top-level group title, for breadcrumbs', () => {
    expect(navEntryFor('claude-code', NESTED)).toEqual({
      label: 'Claude Code',
      slug: 'claude-code',
      groupTitle: 'Memory',
    });
  });
});

describe('docHref', () => {
  it('maps the empty slug to the docs index', () => {
    expect(docHref('')).toBe('/docs');
  });

  it('maps a real slug under /docs', () => {
    expect(docHref('rest-api')).toBe('/docs/rest-api');
  });
});

describe('docMdHref', () => {
  it('maps the empty slug to the docs index mirror', () => {
    expect(docMdHref('')).toBe('/docs.md');
  });

  it('maps a real slug to its .md mirror', () => {
    expect(docMdHref('rest-api')).toBe('/docs/rest-api.md');
  });
});
