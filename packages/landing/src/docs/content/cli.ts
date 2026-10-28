import type { DocPage } from '../types';
import { CLI_INSTALL_COMMAND, INSTALL_SCRIPT_COMMAND, MCP_ENDPOINT } from '@/lib/mcp-docs';

// The @agentage/cli reference; install facts come from lib/mcp-docs.ts so they never drift.
export const cliDoc: DocPage = {
  slug: 'cli',
  title: 'CLI',
  lede: 'Connect this machine to your agentage account from the terminal. One command signs you in through your browser, and from then on the machine is known to your account. The CLI is intentionally small: sign-in, status and update.',
  keywords: [
    'agentage cli',
    'agentage setup',
    'agentage status',
    'connect machine to agentage',
    'cli oauth sign in',
    'headless sign in token',
    'agentage terminal',
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
          md: 'Nothing runs in the background and nothing is installed beyond this package. Every command does its job and exits.',
        },
      ],
    },
    {
      id: 'quickstart',
      title: 'Quickstart',
      blocks: [
        {
          type: 'p',
          md: 'From install to a connected machine:',
        },
        {
          type: 'code',
          language: 'bash',
          code: [
            'agentage setup     # opens your browser to sign in, then prints status',
            'agentage status    # confirm this machine is connected',
          ].join('\n'),
        },
        {
          type: 'p',
          md: '`setup` opens your browser, you sign in, and the session is stored in `~/.agentage`. No password touches the terminal and there is no API key to copy. Run `agentage <command> --help` for the authoritative flags, and `agentage --version` for the installed version.',
        },
      ],
    },
    {
      id: 'setup',
      title: 'Sign in',
      blocks: [
        {
          type: 'p',
          md: '`setup` signs this machine in to your agentage account over OAuth 2.1 (PKCE). It registers a one-off client, opens the sign-in page in your browser and waits for the redirect on a localhost callback.',
        },
        {
          type: 'code',
          language: 'bash',
          code: [
            'agentage setup                 # browser OAuth sign-in, then prints status',
            'agentage setup --no-browser    # print the sign-in URL instead of opening a browser',
            'agentage setup --reauth        # force a fresh sign-in',
            'agentage setup --disconnect    # sign out and remove local credentials',
          ].join('\n'),
        },
        {
          type: 'p',
          md: 'Tokens are stored in `~/.agentage/auth.json` (mode `0600`) and refreshed automatically. Running `setup` while signed in validates the session and prints status instead of starting a new sign-in; an expired session falls through to a fresh sign-in.',
        },
      ],
    },
    {
      id: 'status',
      title: 'Status',
      blocks: [
        {
          type: 'p',
          md: '`status` reports the CLI version, whether an update is available, the target host, your sign-in state and the endpoint. It checks the session against your account rather than trusting the local file.',
        },
        {
          type: 'code',
          language: 'bash',
          code: [
            'agentage status                   # version, update, target, sign-in state, endpoint',
            'agentage status --json            # the same report as JSON on stdout',
            'agentage status --token aga_...   # check with a personal access token',
          ].join('\n'),
        },
        {
          type: 'p',
          md: 'Errors go to stderr and stdout carries only command output, so `status --json` stays parseable in scripts.',
        },
      ],
    },
    {
      id: 'ci',
      title: 'Servers and CI',
      blocks: [
        {
          type: 'p',
          md: 'On a machine without a browser, print the sign-in URL and open it elsewhere, or use a personal access token:',
        },
        {
          type: 'code',
          language: 'bash',
          code: [
            'agentage setup --no-browser               # prints the sign-in URL to open elsewhere',
            'AGENTAGE_TOKEN=aga_... agentage status    # or use a personal access token',
          ].join('\n'),
        },
        {
          type: 'p',
          md: 'Mint a token in your dashboard under **Settings > API tokens**, then set `AGENTAGE_TOKEN` or pass `--token aga_...` to `status`. A token takes precedence over a stored sign-in.',
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
          md: "`status` also surfaces a passive hint when a newer version is available. `update` installs through npm, needs npm 10 or newer, and prints npm's last output lines if the install fails.",
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
            '| `AGENTAGE_SITE_FQDN` | Target host | `agentage.io` |',
            '| `AGENTAGE_CONFIG_DIR` | Config and credentials dir (`auth.json`) | `~/.agentage` |',
            '| `AGENTAGE_TOKEN` | Personal access token for CI and headless machines | unset |',
            '| `NO_COLOR` | Disable colored output (any non-empty value) | unset |',
          ].join('\n'),
        },
      ],
    },
    {
      id: 'exit-codes',
      title: 'Exit codes',
      blocks: [
        {
          type: 'p',
          md: [
            '| Code | Meaning |',
            '| --- | --- |',
            '| `0` | Success, including `--help`, `--version`, and `status` while signed out |',
            '| `1` | A step failed: sign-in or update failed, or an invalid token |',
            '| `2` | Usage error: an unknown command or flag, a missing flag value, or no command |',
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
            `- Not how your AI connects - AI tools reach your memory through the cloud MCP endpoint at [${MCP_ENDPOINT}](/docs/mcp-server) and the HTTP surface at [api.agentage.io](/docs/rest-api), no CLI required.`,
            '- Not a background service - nothing keeps running after a command returns.',
            '- No API keys - one browser sign-in, the same account as every other agentage surface. A personal access token is only for machines without a browser.',
          ].join('\n'),
        },
      ],
    },
  ],
};
