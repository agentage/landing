import type { DocPage } from '../types';

// Task-based prompt library: one section per job, each with a copy-ready prompt
// and the tools it lands on. Tool names + behavior mirror lib/mcp-docs.ts.
export const promptExamplesDoc: DocPage = {
  slug: 'prompt-examples',
  title: 'Prompt examples',
  lede: 'Copy-ready prompts for working with your memory - save a decision, recall a project, keep notes fresh, prune what is stale, and carry context from one AI to the next.',
  keywords: [
    'memory prompts',
    'MCP prompt examples',
    'AI memory prompts',
    'save to memory prompt',
    'recall context prompt',
    'prompt library',
  ],
  sections: [
    {
      id: 'before-you-start',
      title: 'Before you start',
      blocks: [
        {
          type: 'p',
          md: 'Every prompt below assumes your client is connected - see [Connect a client](/docs/connect). Paste one into Claude, Cursor, ChatGPT, or any other connected client and it calls the matching `memory__*` tool for you; you never name a tool yourself.',
        },
        {
          type: 'callout',
          variant: 'info',
          md: 'Notes are addressed by path, like `projects/acme/decisions.md`. Name the path when you know it, and let the agent search when you do not. Search is literal keyword matching, so one distinctive keyword beats a full sentence - see the [MCP tools](/docs/mcp-tools) reference for the exact contracts.',
        },
      ],
    },
    {
      id: 'save',
      title: 'Save knowledge as you work',
      blocks: [
        {
          type: 'p',
          md: 'The habit that pays for everything else: when a decision lands, save it while the reasoning is still in the conversation. A new note is one prompt.',
        },
        {
          type: 'code',
          language: 'text',
          code: [
            'Save this decision to memory at projects/acme/decisions.md:',
            'we chose Postgres full-text search over a separate search service because our',
            'data is already in Postgres and the extra service was not worth the operational',
            "cost. Include today's date and the two options we rejected.",
          ].join('\n'),
          caption: 'Creates the note with memory__write.',
        },
        {
          type: 'p',
          md: 'When the note already exists, ask for an append instead of a rewrite - `memory__write` replaces a note in full, `memory__edit` changes only what you point at.',
        },
        {
          type: 'code',
          language: 'text',
          code: [
            'Append to projects/acme/decisions.md in my memory: we are keeping the old export',
            'endpoint until the mobile app ships, then removing it. Leave the existing entries',
            'untouched.',
          ].join('\n'),
          caption: 'Appends with memory__edit.',
        },
      ],
    },
    {
      id: 'recall',
      title: 'Recall context at session start',
      blocks: [
        {
          type: 'p',
          md: 'Open a session by pulling back what you already know, so the model starts where you left off instead of from nothing.',
        },
        {
          type: 'code',
          language: 'text',
          code: [
            'Search my memory for "acme" and read the most relevant notes. Before we start,',
            'summarize: what we decided, what is still open, and what I was working on last.',
          ].join('\n'),
          caption: 'memory__search ranks the paths, then memory__read pulls the full notes.',
        },
        {
          type: 'p',
          md: 'When you know roughly where something lives, browse instead of searching.',
        },
        {
          type: 'code',
          language: 'text',
          code: [
            'List what is under projects/billing/ in my memory, read the notes that look',
            'relevant to the invoice rewrite, and give me the current state in five bullets.',
          ].join('\n'),
          caption: 'memory__list walks the folder tree, then memory__read.',
        },
      ],
    },
    {
      id: 'fresh',
      title: 'Keep memory fresh',
      blocks: [
        {
          type: 'p',
          md: 'Notes go stale quietly. Ask for a targeted edit rather than a rewrite so the rest of the note survives.',
        },
        {
          type: 'code',
          language: 'text',
          code: [
            'Read projects/acme/stack.md in my memory and update the search section: we moved',
            'from a keyword index to Postgres full-text search last week. Change only that',
            'section and leave the rest of the note as it is.',
          ].join('\n'),
          caption: 'memory__read to see the current text, then memory__edit for the passage.',
        },
        {
          type: 'code',
          language: 'text',
          code: 'Mark projects/acme/roadmap.md as launched in its frontmatter and leave the body alone.',
          caption: 'memory__edit shallow-merges top-level frontmatter keys.',
        },
        {
          type: 'callout',
          variant: 'info',
          md: 'If a note has drifted so far that patching it is fiddly, say so: "rewrite projects/acme/stack.md from scratch based on what we just discussed" replaces it in full with `memory__write`. The previous version stays in history.',
        },
      ],
    },
    {
      id: 'organize',
      title: 'Organize and prune',
      blocks: [
        {
          type: 'p',
          md: 'Once a memory has a few hundred notes, a review pass is worth more than another note. Ask for the audit first, changes second.',
        },
        {
          type: 'code',
          language: 'text',
          code: [
            'List the folder tree under projects/ in my memory and read anything that looks',
            'duplicated or out of date. Give me a table of note, what is stale about it, and',
            'what you would do. Do not change anything yet.',
          ].join('\n'),
          caption: 'memory__list plus memory__read - a read-only audit.',
        },
        {
          type: 'code',
          language: 'text',
          code: [
            'Move the three onboarding notes under scratch/ into onboarding/: read each one,',
            'write it to the new path, then delete the old one. Show me the plan before you',
            'run it.',
          ].join('\n'),
          caption: 'memory__read, memory__write, then memory__delete.',
        },
        {
          type: 'callout',
          variant: 'warning',
          md: 'Deletes are recoverable from history, not a hard wipe - but an agent deleting in bulk is still worth a look first, which is why the prompt asks for the plan.',
        },
      ],
    },
    {
      id: 'cross-tool',
      title: 'Cross-tool workflows',
      blocks: [
        {
          type: 'p',
          md: 'One memory, every AI. Write it down in the tool where the work happened, pick it up in whichever tool you open next.',
        },
        {
          type: 'code',
          language: 'text',
          code: [
            'We just shipped the auth rewrite. Write a handover note to memory at',
            'projects/auth/handover.md: what changed, the new configuration, how to roll it',
            'back, and the two follow-ups still open.',
          ].join('\n'),
          caption: 'End of a coding session, in a terminal or editor client.',
        },
        {
          type: 'code',
          language: 'text',
          code: [
            'Search my memory for "handover" under projects/auth and read the note. I am',
            'briefing the team in ten minutes - turn it into five bullets and one risk.',
          ].join('\n'),
          caption: 'Next morning, in a chat client. Same account, same memory.',
        },
        {
          type: 'callout',
          variant: 'success',
          md: 'Nothing is copied by hand: both clients call the same endpoint on the same account, so a note written in one is readable in the other the moment it is saved.',
        },
      ],
    },
    {
      id: 'standing',
      title: 'Standing instructions',
      blocks: [
        {
          type: 'p',
          md: 'A prompt you paste every day belongs in the agent instructions instead. Drop this into a `CLAUDE.md`, a rules file, or a system prompt, and the agent checks memory before answering and saves what is worth keeping without being asked.',
        },
        {
          type: 'code',
          language: 'markdown',
          code: [
            '## Memory',
            '',
            'You have Agentage Memory connected over MCP: `memory__search`, `memory__read`,',
            '`memory__write`, `memory__edit`, `memory__list`, `memory__delete`.',
            '',
            '- Before answering anything about this project, search memory for the project',
            '  name and read the top hits. Say what you found before you start.',
            '- When we settle a decision, a convention, or a gotcha, save it: append to the',
            '  note that already covers the topic, or create one under `projects/<name>/`.',
            '- Prefer editing an existing note over writing a second note on the same topic.',
            '- Keep entries short and dated. Notes are markdown, addressed by path.',
            '- Never write secrets, tokens, or credentials to memory.',
          ].join('\n'),
          caption:
            'Paste into your agent instructions once; it applies to every session after that.',
        },
        {
          type: 'callout',
          variant: 'info',
          md: 'The memory tools only fire when a request is about your notes. Everyday questions - facts, maths, writing - are answered normally, without touching your memory.',
        },
      ],
    },
  ],
};
