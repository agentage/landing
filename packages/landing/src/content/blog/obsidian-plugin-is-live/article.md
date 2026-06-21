---
title: 'The Obsidian plugin is live - sync your vault to a memory every AI shares'
subtitle: 'Install Agentage Sync from the Obsidian community store, sign in once, and your vault two-way syncs to a private memory that Claude, ChatGPT, Cursor, and any MCP client read and write - the same Markdown you already own.'
description: 'The Agentage Sync plugin is live in the Obsidian community store. Two-way Git sync turns your vault into a memory every AI reads and writes - Markdown you own.'
date: '2026-06-21'
cover: images/cover.png
ogImage: images/cover.png
tags:
  - obsidian
  - announcement
  - mcp
  - ai-memory
  - build-in-public
author: 'Volodymyr Vreshch'
---

Your Obsidian vault is already the best memory you keep. The problem was that the AIs you use could not read it - they opened blank every time while your context sat in files right next to them.

Today that changes. **Agentage Sync is live in the [Obsidian community store](https://community.obsidian.md/plugins/agentage-memory).** Install it, sign in once, and your vault two-way syncs to a private memory that Claude, ChatGPT, Cursor, and any MCP client read and write - the same Markdown files you already own.

## Install it

**Community plugins (recommended)** - in Obsidian: **Settings > Community plugins > Browse**, search **Agentage Sync**, then **Install** and **Enable**. (Or open the [listing](https://community.obsidian.md/plugins/agentage-memory) directly.)

Prefer to track the betas? Two other ways in:

- **BRAT** - install [BRAT](https://github.com/TfTHacker/obsidian42-brat), then **Add beta plugin** > `agentage/obsidian-sync`. It keeps you auto-updated.
- **Manual** - from the [latest release](https://github.com/agentage/obsidian-sync/releases/latest), drop `main.js`, `manifest.json`, and `styles.css` into your vault's `.obsidian/plugins/agentage-memory/` folder, then enable it.

It is desktop only today. Mobile is on the way - the git engine already runs over Obsidian's own network layer, so what is left is verifying sign-in and first sync on real phones.

## Set it up in four steps

### 1. Sign in to Agentage

Open **Settings > Agentage Sync > Sign in to Agentage**. A browser window opens once to authorize the plugin (OAuth 2.1 with PKCE). There is no API key to copy, and the plugin stores no password - your token lives in Obsidian's encrypted secret storage, never in your notes or config.

### 2. Choose a memory

Click the status-bar dot (or run **Agentage Sync: Choose memory** from the command palette), then **Choose memory...** - pick an existing memory or create a new one. A fresh memory makes the cleanest first sync.

### 3. Sync now

From the dot menu or the command palette, run **Agentage Sync: Sync now**. Your notes are committed and pushed. Sync is on demand today; background auto-sync is next.

### 4. Connect your AI

The plugin gets your vault into the memory. The point is that every AI reads it. Point Claude, ChatGPT, Cursor, or any MCP client at the same memory over MCP. [See how to connect ->](/docs/connect)

## Why sync a vault you already own?

Because the files are yours, and now your AIs can use them without you copy-pasting context into every new chat.

Your memory is a bare Git repository - one per memory, hosted in the EU - and it is the source of truth. Your notes stay plain `.md` on your machine and live in that repo on the server, so you can clone or export the whole thing anytime. Nothing is locked in a database you cannot open. If we vanished tomorrow, your memory would not.

Sync runs a real git client over Obsidian's network layer. It never force-pushes: it commits before it pulls, then three-way merges. When two edits touch the same note, nothing is silently dropped - conflicts surface as markers plus a note listing the files, so you resolve them and sync again.

## If you already live in Obsidian

This will feel familiar. Your memory is plain Markdown with YAML frontmatter - the same shape your vault already uses. When another AI writes a note into your memory, it looks like a note you would write yourself, and because you can export anytime, nothing traps it in a machine-only format. The notes you sync today are still notes you can read in ten years.

## A few honest notes

We are building this in the open, so here is the straight version:

- **Desktop only for now.** Obsidian will not offer the plugin on phones yet. Mobile is planned, not shipped.
- **Search is literal.** Memory search matches the words you actually wrote, like a keyword search over your files - fast and predictable, not a fuzzy meaning-match. Search for the terms you would use.
- **Sync is on demand.** You sync from the dot menu or command palette today; automatic background sync is the next thing we are building.
- **No telemetry, no surprise calls.** A fresh or signed-out install makes no network requests at all. The plugin only reaches the network once you sign in or sync.

## FAQ

### Do I need an account?

Yes. You sign in to Agentage once, then pick an existing memory or create a new one. There is no API key to copy or manage.

### Where are my notes stored?

As plain Markdown in your vault, and in a private Git repository - one per memory, hosted in the EU. The repo is the source of truth, readable as ordinary files, and exportable anytime.

### How much storage do I get?

Each memory includes 100 MB of storage. Your notes are plain text, so that goes a long way.

### What happens on a conflict?

Nothing is silently dropped. Concurrent edits three-way merge (per-field frontmatter plus a diff3 body); anything that cannot auto-merge gets conflict markers and an **Agentage Sync Conflicts** note listing the files. Resolve the markers, then sync again.

### Where is my sign-in token kept?

In Obsidian's encrypted secret storage - never in `vaults.json` or `data.json`, and never in your notes.

### Can I leave and take my notes?

Yes. Your memory is a plain Git repo you can clone or export anytime, and your notes stay as Markdown on disk. Ownership is a property of the format, not a promise on a pricing page.

## Sync your vault today

Install Agentage Sync, sign in once, and run a first sync. The next AI you open reads your vault - because it is yours, not any one vendor's. Connecting Claude, ChatGPT, and Cursor to the same memory takes about two minutes from the [connect guide](/docs/connect).

One memory. Every AI. Owned by you.
