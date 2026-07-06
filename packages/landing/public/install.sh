#!/usr/bin/env bash
set -e

# agentage CLI installer. Run: curl -fsSL https://agentage.io/install.sh | bash

err() {
  echo "Error: $1" >&2
  exit 1
}

if ! command -v node >/dev/null 2>&1; then
  err "Node.js is not installed. Get Node 22 or newer from https://nodejs.org, then re-run this."
fi

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 22 ]; then
  err "Node.js 22+ is required (found $(node -v)). Update from https://nodejs.org, then re-run this."
fi

if ! command -v npm >/dev/null 2>&1; then
  err "npm is not installed. It ships with Node.js from https://nodejs.org."
fi

echo "Installing @agentage/cli ..."
npm install -g @agentage/cli

echo ""
echo "Installed. Next steps:"
echo "  1. agentage setup    sign in once in the browser"
echo "  2. agentage status   check the connection"
echo ""
echo "Docs: https://agentage.io/docs/cli"
