// Serialize a DocPage's block tree to clean, self-contained markdown - the source
// for the per-page .md mirrors (agents fetch these). Pure and origin-free so it
// stays statically generatable and easy to unit-test; internal links stay relative.

import type {
  ClientTab,
  CodeTab,
  DocBlock,
  DocPage,
  DocSection,
  Endpoint,
  EndpointGroup,
  Step,
  ToolContract,
  ToolGroup,
} from './types';

const NL = '\n';

const fence = (code: string, language?: string): string =>
  `\`\`\`${language ?? ''}${NL}${code}${NL}\`\`\``;

// Escape pipes and flatten newlines so a value is safe inside one table cell.
const cell = (s: string): string => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');

function table(headers: string[], rows: string[][]): string {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.map(cell).join(' | ')} |`).join(NL);
  return [head, sep, body].join(NL);
}

const blockquote = (md: string): string =>
  md
    .split(NL)
    .map((l) => (l ? `> ${l}` : '>'))
    .join(NL);

function tabsMd(tabs: CodeTab[]): string {
  return tabs
    .map((t) => {
      const parts = [`**${t.label}**`, fence(t.code, t.language)];
      if (t.caption) parts.push(`_${t.caption}_`);
      return parts.join(NL + NL);
    })
    .join(NL + NL);
}

function clientTabsMd(tabs: ClientTab[]): string {
  return tabs.map((t) => `**${t.label}**${NL}${NL}${t.md}`).join(NL + NL);
}

function stepsMd(steps: Step[]): string {
  return steps
    .map((s, i) => {
      const lines = [`**${s.title}**`];
      if (s.body) lines.push(s.body);
      if (s.code) lines.push(fence(s.code, s.language));
      // Indent continuation lines so they stay inside the numbered item.
      const inner = lines
        .join(NL + NL)
        .split(NL)
        .join(`${NL}   `);
      return `${i + 1}. ${inner}`;
    })
    .join(NL);
}

function endpointMd(e: Endpoint): string {
  const status =
    e.status === 'planned' ? ` (planned${e.wave ? `, wave ${e.wave}` : ''})` : ' (live)';
  const parts = [`#### \`${e.method} ${e.path}\``, `${e.summary}${status}`, e.description];
  if (e.params?.length) {
    parts.push(
      table(
        ['Parameter', 'Type', 'Description'],
        e.params.map((p) => [`\`${p.name}\``, p.type, p.description])
      )
    );
  }
  parts.push(`Request:${NL}${NL}${fence(e.curl, 'bash')}`);
  parts.push(`Response:${NL}${NL}${fence(e.response, 'json')}`);
  if (e.fields.length) {
    parts.push(
      table(
        ['Field', 'Type', 'Description'],
        e.fields.map((f) => [`\`${f.name}\``, f.type, f.description])
      )
    );
  }
  if (e.errors.length) {
    parts.push(`Errors: ${e.errors.map((x) => `\`${x.status}\` ${x.meaning}`).join('; ')}`);
  }
  return parts.join(NL + NL);
}

const endpointsMd = (groups: EndpointGroup[]): string =>
  groups
    .map((g) => `### ${g.group}${NL}${NL}${g.items.map(endpointMd).join(NL + NL)}`)
    .join(NL + NL);

function toolMd(t: ToolContract): string {
  const parts = [`#### \`${t.name}\``, t.summary, t.description];
  if (t.behavior) parts.push(`_${t.behavior}_`);
  if (t.args.length) {
    parts.push(
      table(
        ['Argument', 'Type', 'Required', 'Description'],
        t.args.map((a) => [`\`${a.name}\``, a.type, a.required, a.description])
      )
    );
  }
  parts.push(`Example input:${NL}${NL}${fence(t.input, 'json')}`);
  parts.push(`Result:${NL}${NL}${fence(t.result, 'json')}`);
  return parts.join(NL + NL);
}

const toolsMd = (groups: ToolGroup[]): string =>
  groups.map((g) => `### ${g.group}${NL}${NL}${g.items.map(toolMd).join(NL + NL)}`).join(NL + NL);

function blockMd(block: DocBlock): string {
  switch (block.type) {
    case 'p':
      return block.md;
    case 'code':
      return block.caption
        ? `${fence(block.code, block.language)}${NL}${NL}_${block.caption}_`
        : fence(block.code, block.language);
    case 'tabs':
      return tabsMd(block.tabs);
    case 'clienttabs':
      return clientTabsMd(block.tabs);
    case 'callout':
      return blockquote(block.title ? `**${block.title}**${NL}${NL}${block.md}` : block.md);
    case 'steps':
      return stepsMd(block.steps);
    case 'endpoints':
      return endpointsMd(block.groups);
    case 'tools':
      return toolsMd(block.groups);
    case 'diagram':
      return '_[Diagram omitted in the Markdown export - see the HTML page.]_';
  }
}

const sectionMd = (s: DocSection): string =>
  `## ${s.title}${NL}${NL}${s.blocks.map(blockMd).join(NL + NL)}`;

export function docPageToMarkdown(page: DocPage): string {
  const body = page.sections.map(sectionMd).join(NL + NL);
  return `# ${page.title}${NL}${NL}${page.lede}${NL}${NL}${body}${NL}`;
}
