import type { DocPage } from '../types';
import { MCP_ENDPOINT_URL } from '@/lib/mcp-docs';

const MARKETPLACE_URL = 'https://marketplace.visualstudio.com/items?itemName=agentage.agentage';
const OPEN_VSX_URL = 'https://open-vsx.org/extension/agentage/agentage';
const CONNECT_COMMAND = 'Agentage: Connect Memory to this editor';

// The packaged VS Code extension. Facts mirror the extension's own README +
// package.json (agentage/vscode-agentage). The manual route lives at /docs/vs-code.
export const vsCodeExtensionDoc: DocPage = {
  slug: 'vs-code-extension',
  title: 'VS Code extension',
  lede: 'One install and your editor knows about your memory: the extension registers the cloud MCP server with your editor AI, so its agent can search, read, and write your notes. It stores no tokens of its own.',
  keywords: [
    'VS Code extension',
    'VS Code MCP extension',
    'Cursor extension',
    'Windsurf MCP',
    'editor AI memory',
    'agentage extension',
  ],
  sections: [
    {
      id: 'what-it-does',
      title: 'What it does',
      blocks: [
        {
          type: 'p',
          md: `The extension registers the memory server at \`${MCP_ENDPOINT_URL}\` with your editor, so it shows up in the editor's own MCP server list without you writing any config. From there, your editor's AI agent talks to your memory through the six \`memory__*\` tools - ask a question in chat and it answers from your notes.`,
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Extension or manual config?',
          md: 'The extension is the packaged version of the manual setup on the [VS Code](/docs/vs-code) page. Both end at the same endpoint and the same OAuth sign-in - the extension writes and maintains the registration for you, the manual route is a config file you own. Use one or the other, not both.',
        },
      ],
    },
    {
      id: 'install',
      title: 'Install',
      blocks: [
        {
          type: 'p',
          md: `Install **Agentage** from the [Visual Studio Marketplace](${MARKETPLACE_URL}), or from [Open VSX](${OPEN_VSX_URL}) for editors that use that registry. The memory server appears in your editor's MCP server list right after the install - there is no command to run.`,
        },
        {
          type: 'p',
          md: 'It works with VS Code (agent mode), and with Cursor, Windsurf, and VSCodium through Open VSX. VS Code registers the server through its MCP provider API; the other editors get the server written into their MCP config file, merged with what is already there.',
        },
      ],
    },
    {
      id: 'sign-in',
      title: 'Sign in',
      blocks: [
        {
          type: 'steps',
          steps: [
            {
              title: 'Open your AI chat in agent mode',
              body: 'The server is registered but idle until an agent actually uses it.',
            },
            {
              title: 'Approve and sign in',
              body: 'On first use the editor asks you to trust the server, then opens the browser for the OAuth sign-in. Editors do not start an authenticated MCP server on their own, by design.',
            },
            {
              title: 'Ask something from your memory',
              body: 'After the first sign-in the connection stays on. Try asking for a note you know exists.',
            },
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'No tokens in the extension',
          md: "Sign-in and every memory call run through your editor's own MCP client. The extension stores no tokens, sends no data of its own, and collects no telemetry - it only writes the server URL into your editor's MCP configuration.",
        },
      ],
    },
    {
      id: 'if-it-does-not-appear',
      title: 'If the server does not appear',
      blocks: [
        {
          type: 'p',
          md: `On an older editor version or an unfamiliar fork, register the server by hand: open the command palette and run **${CONNECT_COMMAND}**. It performs the same registration on demand. If it still does not show up, fall back to the [manual VS Code setup](/docs/vs-code) or the generic [Connect a client](/docs/connect) guide, and see [Troubleshoot](/docs/troubleshoot).`,
        },
      ],
    },
  ],
};
