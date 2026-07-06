import type { DocPage } from '../types';
import {
  CLI_DAEMON_BASE_URL,
  CLI_DAEMON_MCP_URL,
  CLI_INSTALL_COMMAND,
  CLI_MCP_ADD_COMMAND,
  CLI_STDIO_MCP_JSON,
  INSTALL_SCRIPT_COMMAND,
  MCP_ENDPOINT,
} from '@/lib/mcp-docs';

// The @agentage/cli reference. Install + quickstart first, then a section per
// surface (vaults, memory verbs, local MCP, git sync, the daemon, the optional
// cloud account) as copy-pasteable walkthroughs. Install and command facts come
// from lib/mcp-docs.ts so they never drift from the other surfaces.
export const cliDoc: DocPage = {
  slug: 'cli',
  title: 'CLI',
  lede: 'Your memory in the terminal - plain markdown folders on your disk, searchable and editable offline, served to every AI on your machine over local MCP, and synced to a git remote you control. Everything works offline; the cloud is optional.',
  keywords: [
    'agentage cli',
    'offline memory cli',
    'local mcp server',
    'markdown notes cli',
    'agentage memory terminal',
    'memory command line',
    'git synced notes',
    'local daemon',
  ],
  sections: [
    {
      id: 'install',
      title: 'Install',
      blocks: [
        {
          type: 'p',
          md: 'Needs Node 22 or newer. Install with the one-line script, or straight from npm:',
        },
        {
          type: 'tabs',
          tabs: [
            { label: 'npm', code: CLI_INSTALL_COMMAND, language: 'bash' },
            { label: 'install script', code: INSTALL_SCRIPT_COMMAND, language: 'bash' },
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          md: 'Everything below works fully offline. Signing in to a cloud account is optional - see [Cloud account](#cloud).',
        },
      ],
    },
    {
      id: 'quickstart',
      title: 'Quickstart',
      blocks: [
        {
          type: 'p',
          md: 'From nothing to your notes on disk, no sign-in required:',
        },
        {
          type: 'code',
          language: 'bash',
          code: [
            'agentage vault add notes --local            # register a vault at ~/vaults/notes',
            'echo "# My first note" | agentage memory write welcome.md --vault notes',
            'agentage memory list --vault notes',
            'agentage memory search "first" --vault notes',
            'agentage memory read @notes/welcome.md',
          ].join('\n'),
        },
        {
          type: 'p',
          md: 'Each vault is a plain folder of `.md` files backed by git; every write commits, so nothing is lost and deletes stay recoverable from history.',
        },
      ],
    },
    {
      id: 'vaults',
      title: 'Vaults',
      blocks: [
        {
          type: 'p',
          md: 'A vault is a registered folder of markdown. Add a local folder, or one wired to a git remote you control - the files always live on your disk:',
        },
        {
          type: 'code',
          language: 'bash',
          code: [
            'agentage vault add notes --local             # ~/vaults/notes by default',
            'agentage vault add archive --local ~/archive # or an explicit path',
            'agentage vault add work --git git@github.com:you/memory.git',
            'agentage vault list',
            'agentage vault remove work                   # unregister; files + git history stay on disk',
          ].join('\n'),
        },
        {
          type: 'p',
          md: 'Address a document as `@<vault>/<path>`, or as `<path> --vault <name>`; with a single vault (or a `default` set in `vaults.json`) you can drop the vault entirely. `vault remove` only unregisters a vault - your markdown and its git history are left untouched on disk.',
        },
      ],
    },
    {
      id: 'memory',
      title: 'Working with memory',
      blocks: [
        {
          type: 'p',
          md: 'Six verbs over your local vaults - the same operations every connected AI uses. Add `--json` to any verb for machine-readable output.',
        },
        {
          type: 'code',
          language: 'bash',
          code: [
            'agentage memory search <query...>   # search a vault (git grep); --limit <n> (default 20)',
            'agentage memory read <ref>          # print a document',
            'agentage memory write <ref>         # create or overwrite (--body <text>, or stdin)',
            'agentage memory edit <ref>          # --old/--new (str_replace), or --body (--append)',
            'agentage memory list [folder]       # list documents, optionally under a folder',
            'agentage memory delete <ref>        # delete (recoverable from git history)',
          ].join('\n'),
        },
        {
          type: 'p',
          md: '`write` reads the body from `--body`, or from stdin when you pass `--body -` or omit it; add `--frontmatter` to set YAML frontmatter as a JSON object:',
        },
        {
          type: 'code',
          language: 'bash',
          code: [
            'agentage memory write work/plan.md --vault notes --body "Q3 focus is search."',
            'echo "# Draft" | agentage memory write drafts/idea.md --vault notes',
            `agentage memory write pinned.md --vault notes --frontmatter '{"tags":["pinned"]}' --body "Roadmap"`,
          ].join('\n'),
        },
        {
          type: 'p',
          md: '`edit` does an exact, unique-substring replace with `--old`/`--new`, or replaces (or appends to) the whole body with `--body` `[--append]`:',
        },
        {
          type: 'code',
          language: 'bash',
          code: [
            'agentage memory edit @notes/work/plan.md --old "search" --new "full-text search"',
            'agentage memory edit @notes/work/plan.md --body "- shipped" --append',
          ].join('\n'),
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'How the engine behaves',
          md: 'Every vault is a git working copy, so each write is a commit and a `delete` is recoverable from history - nothing is silently lost. Search is `git grep`: literal substring matching, so search one distinctive keyword, not a phrase. Reads clamp at 64 KB, and the engine refuses to store obvious secrets like API keys and tokens.',
        },
      ],
    },
    {
      id: 'connect',
      title: 'Connect your AI (local MCP)',
      blocks: [
        {
          type: 'p',
          md: '`agentage mcp` serves your local vaults to any AI on this machine over **stdio**, exposing the same frozen six `memory__*` tools as the cloud endpoint. Point a client at it by spawning the command - see the [MCP tools reference](/docs/mcp-tools) for the tool contracts.',
        },
        {
          type: 'clienttabs',
          tabs: [
            {
              label: 'Claude Code',
              md: `Register the stdio server in one command:\n\n\`\`\`bash\n${CLI_MCP_ADD_COMMAND}\n\`\`\`\n\nAny other stdio MCP client works the same way - spawn \`agentage mcp\`.`,
            },
            {
              label: 'Cursor',
              md: `Add the server to \`~/.cursor/mcp.json\`:\n\n\`\`\`json\n${CLI_STDIO_MCP_JSON}\n\`\`\``,
            },
            {
              label: 'Any client',
              md: `Drop this into your client's MCP config (\`.vscode/mcp.json\`, a project \`.mcp.json\`, and the like):\n\n\`\`\`json\n${CLI_STDIO_MCP_JSON}\n\`\`\``,
            },
          ],
        },
        {
          type: 'p',
          md: `Clients that speak Streamable HTTP can instead POST to the daemon's local endpoint \`${CLI_DAEMON_MCP_URL}\` (stateless; a GET returns 405). The full loopback surface is documented in the [local API](/docs/local-api).`,
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Local routing, no auth',
          md: `On this machine the tools address vaults directly: a \`@<vault>/\` prefix routes to that vault, and \`memory__list\` at the root shows each vault as a top-level folder. The loopback socket has no auth - it is bound to \`127.0.0.1\` and never exposed to the network. For AI outside this machine, use the cloud endpoint \`${MCP_ENDPOINT}\`.`,
        },
      ],
    },
    {
      id: 'sync',
      title: 'Git sync',
      blocks: [
        {
          type: 'p',
          md: 'A `--git` vault is a local working copy wired to a remote you control. The daemon commits and pushes your changes and pulls remote ones on an interval - `interval` seconds per origin (default 300; `0` = manual only). Trigger a round yourself with `vault sync`:',
        },
        {
          type: 'code',
          language: 'bash',
          code: [
            'agentage vault add work --git git@github.com:you/memory.git',
            'agentage vault sync            # sync every git-backed vault now',
            'agentage vault sync work       # just one',
          ].join('\n'),
        },
        {
          type: 'p',
          md: 'Your local write is always saved first: an unreachable remote never blocks a read or write, and a conflicting remote edit lands beside yours as `<file>.conflict.md` instead of overwriting it - no write is ever lost.',
        },
        {
          type: 'p',
          md: 'By default `.obsidian/` and `data.json` are kept out of sync. Set `interval` and an `ignore` list per origin in `vaults.json`; a set `ignore` **replaces** those defaults (gitignore syntax), and an empty list syncs everything:',
        },
        {
          type: 'code',
          language: 'json',
          caption: '~/.agentage/vaults.json',
          code: `{
  "version": 1,
  "vaults": {
    "work": {
      "path": "~/vaults/work",
      "origin": [
        {
          "remote": "git@github.com:you/memory.git",
          "interval": 900,
          "ignore": [".obsidian/", "*.tmp"]
        }
      ]
    }
  }
}`,
        },
      ],
    },
    {
      id: 'daemon',
      title: 'The daemon',
      blocks: [
        {
          type: 'p',
          md: `One small background process (loopback only, \`${CLI_DAEMON_BASE_URL}\` by default) owns the engine so vault writes are serialized and git sync runs in the background. It autostarts on the first memory verb and restarts itself after an update; you rarely touch it directly.`,
        },
        {
          type: 'code',
          language: 'bash',
          code: [
            'agentage daemon status         # pid, uptime, version, per-vault sync state',
            'agentage daemon start          # start it explicitly (idempotent)',
            'agentage daemon stop           # stop it',
          ].join('\n'),
        },
        {
          type: 'p',
          md: 'To skip the daemon and run verbs in-process, pass `--no-daemon` or set `AGENTAGE_NO_DAEMON=1`. It also serves a JSON HTTP API on the same port for local scripts and tools - see the [local API](/docs/local-api).',
        },
      ],
    },
    {
      id: 'cloud',
      title: 'Cloud account',
      blocks: [
        {
          type: 'p',
          md: 'Optionally sign in to connect this machine to your agentage account over OAuth 2.1 (PKCE) - no password touches the terminal, no API key to copy. Every memory verb above works fully offline without it.',
        },
        {
          type: 'code',
          language: 'bash',
          code: [
            'agentage setup                 # browser OAuth sign-in, then prints status',
            'agentage setup --no-browser    # print the sign-in URL instead of opening a browser',
            'agentage setup --reauth        # force a fresh sign-in',
            'agentage setup --disconnect    # sign out and remove local credentials',
            'agentage status                # CLI version, target, sign-in state (--json)',
          ].join('\n'),
        },
        {
          type: 'p',
          md: 'Tokens are stored in `~/.agentage/auth.json` (mode `0600`).',
        },
      ],
    },
    {
      id: 'update',
      title: 'Staying current',
      blocks: [
        {
          type: 'code',
          language: 'bash',
          code: [
            'agentage update                # install the latest published version',
            'agentage update --check        # report whether an update is available',
          ].join('\n'),
        },
        {
          type: 'p',
          md: '`status` also surfaces a passive hint, at most once an hour, when a newer version is available.',
        },
      ],
    },
    {
      id: 'env',
      title: 'Environment',
      blocks: [
        {
          type: 'p',
          md: 'Override the defaults with environment variables:',
        },
        {
          type: 'p',
          md: [
            '| Variable | Purpose | Default |',
            '| --- | --- | --- |',
            '| `AGENTAGE_CONFIG_DIR` | Config + credentials dir (`auth.json`, `vaults.json`, daemon state) | `~/.agentage` |',
            '| `AGENTAGE_DAEMON_PORT` | Local daemon port | `4243` |',
            '| `AGENTAGE_NO_DAEMON` | Set to `1` to run memory verbs in-process | unset |',
            '| `AGENTAGE_SITE_FQDN` | Cloud target host | `agentage.io` |',
          ].join('\n'),
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
            '- Not a cloud client - reads and writes hit local files first; the cloud MCP endpoint is at [memory.agentage.io/mcp](/docs/mcp-server) and the read-only HTTP surface at [api.agentage.io](/docs/rest-api).',
            '- Not another database - vaults are ordinary folders; uninstall the CLI and your markdown is still there.',
            '- No API keys - one optional sign-in, the same account as every other agentage surface.',
          ].join('\n'),
        },
      ],
    },
  ],
};
