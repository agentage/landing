import type { DocPage } from '../types';
import { MCP_ENDPOINT, MCP_AUTH_ORIGIN } from '@/lib/mcp-docs';

const STORE_URL = 'https://community.obsidian.md/plugins/agentage-memory';

// The Obsidian plugin guide. Facts mirror the plugin's own manifest + README
// (agentage/obsidian-sync); keep the two in step when the plugin changes.
export const obsidianDoc: DocPage = {
  slug: 'obsidian',
  title: 'Obsidian plugin',
  lede: 'Agentage Sync turns an Obsidian vault into your memory: two-way git sync to a memory you own, and the same notes readable by every AI you connect over MCP.',
  keywords: [
    'Obsidian plugin',
    'Obsidian MCP',
    'Obsidian sync',
    'Agentage Sync',
    'Obsidian AI memory',
    'sync Obsidian vault',
  ],
  sections: [
    {
      id: 'what-it-does',
      title: 'What it does',
      blocks: [
        {
          type: 'p',
          md: 'The plugin syncs your vault two ways with a memory on the server, over git. Your notes stay plain markdown on your disk; the server side is a git repo you can clone or export anytime. Once a vault is synced, any MCP client you connect reads and writes the same notes - so an edit in Obsidian shows up in your AI, and a note an AI writes lands in your vault on the next sync.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Desktop only',
          md: 'The plugin runs on Obsidian desktop. Mobile is not supported yet.',
        },
      ],
    },
    {
      id: 'install',
      title: 'Install',
      blocks: [
        {
          type: 'steps',
          steps: [
            {
              title: 'Open the community store',
              body: 'In Obsidian: **Settings → Community plugins → Browse**.',
            },
            {
              title: 'Search for Agentage Sync',
              body: `Search **Agentage Sync**, then **Install** and **Enable**. You can also open the [store listing](${STORE_URL}) directly.`,
            },
          ],
        },
      ],
    },
    {
      id: 'connect',
      title: 'Connect and sync',
      blocks: [
        {
          type: 'steps',
          steps: [
            {
              title: 'Sign in',
              body: `**Settings → Agentage Sync → Sign in to Agentage**. A browser window opens for the sign-in at **${MCP_AUTH_ORIGIN}** (OAuth 2.1 with PKCE). The plugin keeps your access in Obsidian's encrypted storage - never in your notes or plugin config.`,
            },
            {
              title: 'Choose a memory',
              body: 'Pick which memory this vault syncs into, or create a new one, from the chooser. A fresh memory makes the cleanest first sync.',
            },
            {
              title: 'Sync',
              body: 'Run **Sync now** from the status-bar dot, the ribbon, or the command palette. Your notes are committed and pushed; changes on the server are pulled in.',
            },
          ],
        },
        {
          type: 'p',
          md: 'The status-bar dot shows the current state at a glance and opens a menu with Sync now, the dashboard, and settings.',
        },
      ],
    },
    {
      id: 'sync-behavior',
      title: 'How syncing behaves',
      blocks: [
        {
          type: 'p',
          md: [
            '- **Two-way** - each sync pushes your local edits and pulls anything that changed on the server.',
            '- **Plain markdown** - files stay `.md` in your vault, and as a git repo on the server side.',
            '- **Safe merges** - edits made in two places merge automatically where they can.',
            '- **Conflicts are flagged, never dropped** - anything that cannot be merged is listed in a conflicts note in your vault. Resolve those files, then sync again.',
          ].join('\n'),
        },
        {
          type: 'callout',
          variant: 'info',
          md: "Because the history is git, an accidental overwrite or delete is recoverable from the memory's history rather than gone.",
        },
      ],
    },
    {
      id: 'ai-access',
      title: 'Reading the vault from your AI',
      blocks: [
        {
          type: 'p',
          md: `Syncing a vault does not, by itself, put it in front of an AI. The plugin's **Expose remote MCP** setting (on by default) makes the memory readable and writable over the cloud MCP server at \`${MCP_ENDPOINT}\` - then connect Claude, Cursor, ChatGPT, or any other client the usual way. See [Connect a client](/docs/connect).`,
        },
      ],
    },
    {
      id: 'galaxy',
      title: 'Agentage Galaxy',
      blocks: [
        {
          type: 'p',
          md: 'Agentage Galaxy is a separate Obsidian plugin: it renders your vault as a rotating 3D force-graph, with notes as nodes, links as edges, and folders as colored clusters. It is a visualization only - it does not sync anything and does not require an account. Install it the same way, by searching **Agentage Galaxy** in the community store.',
        },
      ],
    },
  ],
};
