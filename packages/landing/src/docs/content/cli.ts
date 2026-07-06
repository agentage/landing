import type { DocPage } from '../types';
import { CLI_DAEMON_MCP_URL, CLI_INSTALL_COMMAND, CLI_MCP_ADD_COMMAND } from '@/lib/mcp-docs';

// The @agentage/cli reference. Same authoring recipe as rest-api / mcp-tools:
// plain serializable DocPage data. Install and command facts come from
// lib/mcp-docs.ts so they never drift from the other surfaces.
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
      id: 'install',
      title: 'Install',
      blocks: [
        {
          type: 'code',
          language: 'bash',
          code: CLI_INSTALL_COMMAND,
        },
        {
          type: 'p',
          md: 'Needs Node 22+. Then sign in once:',
        },
        {
          type: 'code',
          language: 'bash',
          code: 'agentage setup',
        },
        {
          type: 'p',
          md: 'Opens the browser for OAuth sign-in (no API key to copy). `agentage status` shows the connection; `agentage setup --no-browser` prints the link instead.',
        },
      ],
    },
    {
      id: 'vaults',
      title: 'Vaults are folders',
      blocks: [
        {
          type: 'p',
          md: 'A vault is a folder of plain `.md` files you choose. The CLI keeps a small registry at `~/.agentage/vaults.json`:',
        },
        {
          type: 'code',
          language: 'bash',
          code: [
            'agentage vault add notes --local --path ~/notes',
            'agentage vault add work --git git@github.com:you/work-notes.git',
            'agentage vault list',
          ].join('\n'),
        },
        {
          type: 'p',
          md: [
            '- `--local` - just a folder, no sync.',
            '- `--git <remote>` - the folder stays in sync with your own git remote in the background.',
          ].join('\n'),
        },
      ],
    },
    {
      id: 'notes',
      title: 'Work with notes - offline',
      blocks: [
        {
          type: 'p',
          md: 'The same six operations every AI uses, as commands. Everything works with the network down:',
        },
        {
          type: 'code',
          language: 'bash',
          code: [
            'agentage memory search "postgres" --limit 5',
            'agentage memory read work/tasks/plan.md',
            'agentage memory write work/tasks/plan.md --body -',
            'agentage memory edit work/tasks/plan.md --old "draft" --new "final"',
            'agentage memory list work/',
            'agentage memory delete work/old.md',
          ].join('\n'),
        },
        {
          type: 'p',
          md: 'Address a specific vault with `@<vault>/` in the path (e.g. `@work/tasks/plan.md`); otherwise the default vault is used.',
        },
      ],
    },
    {
      id: 'connect',
      title: 'Connect your AI',
      blocks: [
        {
          type: 'p',
          md: 'The CLI is also a local MCP server with the same six `memory__` tools as the cloud endpoint:',
        },
        {
          type: 'code',
          language: 'bash',
          code: CLI_MCP_ADD_COMMAND,
        },
        {
          type: 'p',
          md: `Any stdio MCP client works the same way. Prefer HTTP? The background daemon serves Streamable HTTP at \`${CLI_DAEMON_MCP_URL}\` - local only, never exposed to the network.`,
        },
      ],
    },
    {
      id: 'daemon',
      title: 'The daemon',
      blocks: [
        {
          type: 'p',
          md: 'One background process owns writes and sync so several tools can share the same vaults safely:',
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
          md: 'Commands start it automatically when needed (`--no-daemon` skips). It restarts itself after an update.',
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
          md: 'Conflicting remote edits never overwrite your local notes - they land next to them as `<file>.conflict.md`. Unreachable remotes never block writing; notes are saved locally first.',
        },
        {
          type: 'p',
          md: 'Syncing a vault with your agentage account memory (the one your cloud MCP clients see) is coming soon.',
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
          md: 'Checks for a new version (also hinted passively once per hour) and walks through the npm update.',
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
            '- No API keys - one OAuth sign-in, same account as every other agentage surface.',
          ].join('\n'),
        },
      ],
    },
  ],
};
