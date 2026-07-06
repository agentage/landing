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

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Live = callable today; planned = draft contract from the north-star spec. */
export type EndpointStatus = 'live' | 'planned';

export interface EndpointArg {
  /** Parameter or response field name, e.g. `vault` or `vaults[].name`. */
  name: string;
  /** Type + location, e.g. "string, body", "integer, query", "array". */
  type: string;
  description: string;
}

export interface EndpointError {
  /** HTTP status code, e.g. "401". */
  status: string;
  meaning: string;
}

export interface Endpoint {
  method: HttpMethod;
  path: string;
  /** One-line summary shown on the collapsed row. */
  summary: string;
  status: EndpointStatus;
  /** Rollout wave for planned endpoints, e.g. 2 or 3. */
  wave?: number;
  description: string;
  params?: EndpointArg[];
  /** curl example. */
  curl: string;
  /** 200 response body. */
  response: string;
  /** Response field reference. */
  fields: EndpointArg[];
  errors: EndpointError[];
}

export interface EndpointGroup {
  /** Group heading, e.g. "Vaults", "Notes", "Search & export". */
  group: string;
  items: Endpoint[];
}

/** Badge color bucket for an MCP tool, mapped from its verb semantics. */
export type ToolBadgeColor = 'read' | 'write' | 'edit' | 'delete';

export interface ToolArg {
  /** Argument key, e.g. `query` or `old_str`. */
  name: string;
  /** Type + constraints, e.g. "string", "integer, 1-50". */
  type: string;
  /** Requiredness + default, e.g. "required", "optional, default 20". */
  required: string;
  description: string;
}

export interface ToolContract {
  /** Full tool key, e.g. `memory__search`. */
  name: string;
  /** Short verb shown on the badge, e.g. "search". */
  verb: string;
  /** Badge color bucket. */
  color: ToolBadgeColor;
  /** One-line summary shown on the collapsed row. */
  summary: string;
  description: string;
  /** One-line behavior note, shown when it clarifies a non-obvious contract. */
  behavior?: string;
  args: ToolArg[];
  /** Example input JSON. */
  input: string;
  /** Result JSON. */
  result: string;
}

export interface ToolGroup {
  /** Group heading, e.g. "Read", "Write". */
  group: string;
  items: ToolContract[];
}

export type DocBlock =
  | { type: 'p'; md: string }
  | { type: 'code'; code: string; language?: string; caption?: string }
  | { type: 'tabs'; tabs: CodeTab[] }
  | { type: 'clienttabs'; tabs: ClientTab[] }
  | { type: 'callout'; variant: CalloutVariant; title?: string; md: string }
  | { type: 'steps'; steps: Step[] }
  | { type: 'endpoints'; groups: EndpointGroup[] }
  | { type: 'tools'; groups: ToolGroup[] };

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
  /** Page-specific SEO keywords (merged with the shared docs keywords). */
  keywords?: string[];
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
