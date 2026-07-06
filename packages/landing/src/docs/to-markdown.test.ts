import { describe, expect, it } from 'vitest';
import { docPageToMarkdown } from './to-markdown';
import type { DocPage } from './types';

// A fixture exercising every DocBlock variant, so the serializer's output shape
// is pinned for each one.
const FIXTURE: DocPage = {
  slug: 'fixture',
  title: 'Fixture page',
  lede: 'A page that uses every block type.',
  sections: [
    {
      id: 'prose',
      title: 'Prose & code',
      blocks: [
        { type: 'p', md: 'A paragraph with **bold** and a `code` span.' },
        { type: 'code', language: 'bash', code: 'echo hi', caption: 'run it' },
        { type: 'diagram' },
      ],
    },
    {
      id: 'tabs',
      title: 'Tabs',
      blocks: [
        {
          type: 'tabs',
          tabs: [
            { label: 'npm', language: 'bash', code: 'npm i x', caption: 'via npm' },
            { label: 'pnpm', language: 'bash', code: 'pnpm add x' },
          ],
        },
        {
          type: 'clienttabs',
          tabs: [
            { label: 'VS Code', md: 'Open **settings** then add the server.' },
            { label: 'Cursor', md: 'Paste the config.' },
          ],
        },
      ],
    },
    {
      id: 'callout-steps',
      title: 'Callout & steps',
      blocks: [
        { type: 'callout', variant: 'info', title: 'Heads up', md: 'Line one.\nLine two.' },
        {
          type: 'steps',
          steps: [
            { title: 'First', body: 'Do the thing.' },
            { title: 'Second', code: 'run --now', language: 'bash' },
          ],
        },
      ],
    },
    {
      id: 'reference',
      title: 'Reference',
      blocks: [
        {
          type: 'endpoints',
          groups: [
            {
              group: 'Vaults',
              items: [
                {
                  method: 'GET',
                  path: '/v1/vaults',
                  summary: 'List vaults',
                  status: 'live',
                  description: 'Returns the vaults the token can see.',
                  params: [{ name: 'limit', type: 'integer, query', description: 'Page size.' }],
                  curl: 'curl https://api.example/v1/vaults',
                  response: '{ "data": [] }',
                  fields: [{ name: 'data[].name', type: 'string', description: 'Vault name.' }],
                  errors: [{ status: '401', meaning: 'Missing token.' }],
                },
              ],
            },
          ],
        },
        {
          type: 'tools',
          groups: [
            {
              group: 'Read',
              items: [
                {
                  name: 'memory__search',
                  verb: 'search',
                  color: 'read',
                  summary: 'Find notes by keyword.',
                  description: 'Ranks notes by match count.',
                  behavior: 'Never returns full bodies.',
                  args: [
                    {
                      name: 'query',
                      type: 'string',
                      required: 'required',
                      description: 'Keyword.',
                    },
                  ],
                  input: '{ "query": "postgres" }',
                  result: '{ "results": [] }',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

describe('docPageToMarkdown', () => {
  const md = docPageToMarkdown(FIXTURE);

  it('emits the H1 title, lede, and H2 section headings', () => {
    expect(md.startsWith('# Fixture page\n\nA page that uses every block type.\n')).toBe(true);
    expect(md).toContain('## Prose & code');
    expect(md).toContain('## Reference');
  });

  it('serializes paragraphs verbatim', () => {
    expect(md).toContain('A paragraph with **bold** and a `code` span.');
  });

  it('fences code with its language and appends the caption', () => {
    expect(md).toContain('```bash\necho hi\n```\n\n_run it_');
  });

  it('renders a diagram as a one-line skip note', () => {
    expect(md).toContain('_[Diagram omitted in the Markdown export - see the HTML page.]_');
  });

  it('renders code tabs as one fenced block per tab with a bold label', () => {
    expect(md).toContain('**npm**\n\n```bash\nnpm i x\n```\n\n_via npm_');
    expect(md).toContain('**pnpm**\n\n```bash\npnpm add x\n```');
  });

  it('renders client tabs as bold label + markdown body', () => {
    expect(md).toContain('**VS Code**\n\nOpen **settings** then add the server.');
  });

  it('renders callouts as blockquotes with a bold title, prefixing every line', () => {
    expect(md).toContain('> **Heads up**\n>\n> Line one.\n> Line two.');
  });

  it('renders steps as a numbered list, indenting fenced continuation lines', () => {
    expect(md).toContain('1. **First**\n   \n   Do the thing.');
    expect(md).toContain('2. **Second**\n   \n   ```bash\n   run --now\n   ```');
  });

  it('renders endpoints with a group heading, method/path, params table and errors', () => {
    expect(md).toContain('### Vaults');
    expect(md).toContain('#### `GET /v1/vaults`');
    expect(md).toContain('List vaults (live)');
    expect(md).toContain('| Parameter | Type | Description |');
    expect(md).toContain('| `limit` | integer, query | Page size. |');
    expect(md).toContain('Errors: `401` Missing token.');
  });

  it('renders tools with the name, behavior note and an args table', () => {
    expect(md).toContain('### Read');
    expect(md).toContain('#### `memory__search`');
    expect(md).toContain('_Never returns full bodies._');
    expect(md).toContain('| Argument | Type | Required | Description |');
    expect(md).toContain('| `query` | string | required | Keyword. |');
  });
});
