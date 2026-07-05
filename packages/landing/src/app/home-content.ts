import {
  Plug,
  Share2,
  FileText,
  ShieldCheck,
  Search,
  Boxes,
  RefreshCw,
  Database,
  Lock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { MCP_ENDPOINT } from '@/lib/mcp-docs';

// Copy for the homepage sections. Kept out of page.tsx so the page stays JSX-only.

export interface IconCard {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const problems: IconCard[] = [
  {
    icon: Boxes,
    title: 'You run 4–5 AI tools a day',
    body: 'Claude, ChatGPT, Cursor, Claude Code. Each one opens with a blank slate and no idea what the others already know.',
  },
  {
    icon: RefreshCw,
    title: 'So you became the memory',
    body: 'Every switch, you re-paste the architecture, the decisions, the constraints. Fifteen to thirty minutes, several times a day, forever.',
  },
  {
    icon: Database,
    title: 'And vendor memory vanishes',
    body: 'Built-in memory gets deprecated or silently wiped. The context you spent weeks shaping disappears the next time a tool ships a breaking change.',
  },
];

export const steps: IconCard[] = [
  {
    icon: Plug,
    title: 'Connect once',
    body: `Paste ${MCP_ENDPOINT} into Claude, ChatGPT, Cursor, or Claude Code. Signing in once creates your account - no API keys, no config, no plumbing.`,
  },
  {
    icon: Share2,
    title: 'Every AI shares it',
    body: 'They all read and write the same memory. Make a decision in Claude; Cursor sees it the moment you switch. No more re-explaining.',
  },
  {
    icon: FileText,
    title: 'Yours to keep',
    body: 'Your memory is plain markdown, stored in the EU and exportable anytime. No black-box vector store, no lock-in - it stays readable long after a tool changes.',
  },
];

export const features: IconCard[] = [
  {
    icon: FileText,
    title: 'Files first',
    body: 'Plain markdown with YAML frontmatter - readable, exportable, and yours to keep forever. Not a black-box vector store.',
  },
  {
    icon: Share2,
    title: 'Every AI, one memory',
    body: 'Cross-vendor by default through MCP. Not a walled garden tied to one assistant - the same memory across every tool you use.',
  },
  {
    icon: Lock,
    title: 'Owned, not rented',
    body: 'Your own memory in the cloud, EU-hosted and exportable anytime. Markdown you keep, not a format you rent. Zero lock-in.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    body: 'EU-resident by architecture. Your data stays in your region, never a black box owned by someone else.',
  },
  {
    icon: Search,
    title: 'Fast search',
    body: 'Lexical search across your whole memory, so an AI can find why you chose SQLite - not just that you mentioned it.',
  },
  {
    icon: Plug,
    title: 'Pluggable',
    body: 'One endpoint, a growing set of tools. Memory is endpoint #1 of the Agentage MCP suite - more AI-native tools land over time.',
  },
];

export const contrast: { k: string; v: string }[] = [
  {
    k: 'Closed memory DBs',
    v: 'Opaque vectors, someone else’s cloud, price cliffs. You can’t read your own memory.',
  },
  {
    k: 'Built-in AI memory',
    v: 'One assistant only. Deprecated or wiped when the vendor decides. Nothing crosses tools.',
  },
  {
    k: 'DIY files + scripts',
    v: 'Free, but you maintain the sync, the cron jobs, and the glue. No cross-vendor reach.',
  },
];
