// Content model for the docs pages. Pages are authored as plain, serializable
// data (no JSX / functions) so a server component can pass them straight to the
// client renderer - enhancing a page means editing data, not markup.

export type CalloutVariant = 'info' | 'warning' | 'success';

export interface CodeTab {
  /** Tab label, e.g. "npm", "Claude Code". */
  label: string;
  code: string;
  /** Code-block language chip. */
  language?: string;
  /** Optional one-line caption under the code. */
  caption?: string;
}

export interface Step {
  title: string;
  /** Markdown - inline links / `code` / **bold** supported. */
  body?: string;
  code?: string;
  language?: string;
}

export interface ClientTab {
  /** Client name, e.g. "VS Code", "ChatGPT". */
  label: string;
  /** Markdown body - supports one-click links, numbered steps, fenced code. */
  md: string;
}

export type DocBlock =
  | { type: 'p'; md: string }
  | { type: 'code'; code: string; language?: string; caption?: string }
  | { type: 'tabs'; tabs: CodeTab[] }
  | { type: 'clienttabs'; tabs: ClientTab[] }
  | { type: 'callout'; variant: CalloutVariant; title?: string; md: string }
  | { type: 'steps'; steps: Step[] };

export interface DocSection {
  /** Anchor id - also the table-of-contents target. */
  id: string;
  /** H2 heading + TOC label. */
  title: string;
  blocks: DocBlock[];
}

export interface DocPage {
  /** URL slug. '' is the index ('/'). */
  slug: string;
  title: string;
  /** One-line intro under the H1. */
  lede: string;
  sections: DocSection[];
}

export interface DocNavItem {
  label: string;
  /** Slug of a real page, or undefined for a not-yet-written stub. */
  slug?: string;
  comingSoon?: boolean;
}

export interface DocNavGroup {
  title: string;
  items: DocNavItem[];
}
