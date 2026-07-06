import type { DocPage } from '../types';
import {
  CLI_DAEMON_MCP_URL,
  CLI_INSTALL_COMMAND,
  CLI_MCP_ADD_COMMAND,
  INSTALL_SCRIPT_COMMAND,
} from '@/lib/mcp-docs';

// The @agentage/cli reference. A numbered getting-started flow first, then the
// deeper sections. Install and command facts come from lib/mcp-docs.ts so they
// never drift from the other surfaces.
export const cliDoc: DocPage = {
  slug: 'cli',
  title: 'CLI',
  lede: 'Your memory in the terminal - plain markdown folders on your disk, searchable and editable offline, served to every AI on your machine over local MCP.',
  keywords: [
    'agentage cli',
    'offline memory cli',
    'local mcp server',
    'markdown notes cli',
    'agentage memory terminal',
    'memory command line',
  ],
  sections: [
    {
      id: 'get-started',
      title: 'Get started',
      blocks: [
        {
          type: 'p',
          md: 'Five steps from nothing to your notes in every AI on your machine.',
        },
        {
          type: 'steps',
          steps: [
            {
              title: 'Install',
              body: `Needs Node 22 or newer. Prefer npm? Run \`${CLI_INSTALL_COMMAND}\` instead.`,
              code: INSTALL_SCRIPT_COMMAND,
              language: 'bash',
            },
            {
              title: 'Sign in',
              body: 'Opens your browser for a one-time sign-in - no API key to copy. `agentage status` shows the connection any time; `agentage setup --no-browser` prints the link instead.',
              code: 'agentage setup',
              language: 'bash',
            },
            {
              title: 'Add a vault',
              body: 'A vault is just a folder of plain `.md` files you pick. Add a local folder, or one kept in sync with your own git remote:',
              code: [
                'agentage vault add notes --local ~/notes',
                'agentage vault add work --git git@github.com:you/work-notes.git',
                'agentage vault list',
              ].join('\n'),
              language: 'bash',
            },
            {
              title: 'Use your notes',
              body: 'The same six operations every AI uses, now as commands - and they keep working with the network down. Address one vault with `@<vault>/` in the path; otherwise your default vault is used.',
              code: [
                'agentage memory search "postgres" --limit 5',
                'agentage memory read work/tasks/plan.md',
                'agentage memory write work/tasks/plan.md --body -',
              ].join('\n'),
              language: 'bash',
            },
            {
              title: 'Connect your AI',
              body: 'The CLI is also a local MCP server with the same six `memory__` tools as the cloud endpoint. Add it to Claude Code - any stdio MCP client works the same way:',
              code: CLI_MCP_ADD_COMMAND,
              language: 'bash',
            },
          ],
        },
      ],
    },
    {
      id: 'daemon',
      title: 'The daemon',
      blocks: [
        {
          type: 'p',
          md: 'One background process keeps writes and sync tidy so several tools can share the same vaults safely:',
        },
        {
          type: 'code',
          language: 'bash',
          code: ['agentage daemon start', 'agentage daemon status', 'agentage daemon stop'].join(
            '\n'
          ),
        },
        {
          type: 'p',
          md: `It starts automatically when a command needs it (\`--no-daemon\` skips) and restarts itself after an update. Prefer HTTP? It also serves the same tools locally at \`${CLI_DAEMON_MCP_URL}\` - never exposed to the network.`,
        },
      ],
    },
    {
      id: 'sync',
      title: 'Sync',
      blocks: [
        {
          type: 'p',
          md: 'Git-backed vaults commit, pull and push on an interval you set (`--interval` seconds, `0` = manual). Trigger a round yourself:',
        },
        {
          type: 'code',
          language: 'bash',
          code: 'agentage vault sync work',
        },
        {
          type: 'p',
          md: 'Your local notes are always saved first: an unreachable remote never blocks a write, and a conflicting remote edit lands next to yours as `<file>.conflict.md` instead of overwriting it. Syncing a vault with your agentage account memory is coming soon.',
        },
      ],
    },
    {
      id: 'updates',
      title: 'Staying current',
      blocks: [
        {
          type: 'code',
          language: 'bash',
          code: 'agentage update',
        },
        {
          type: 'p',
          md: 'Checks for a new version (also hinted once an hour) and walks you through the update.',
        },
      ],
    },
    {
      id: 'not',
      title: 'What it is not',
      blocks: [
        {
          type: 'p',
          md: [
            '- Not a cloud client - reads and writes are local files first; the cloud MCP endpoint is at [memory.agentage.io/mcp](/docs/mcp-server).',
            '- Not another database - vaults are ordinary folders; delete the CLI and your markdown is still there.',
            '- No API keys - one sign-in, the same account as every other agentage surface.',
          ].join('\n'),
        },
      ],
    },
  ],
};
