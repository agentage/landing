import * as React from 'react';
import { Chip, EDGE, GridWrap, HOT, LBL, M, MapDefs, NODE, S, T } from './memory-map-shared';

// Variant 2: horizontal flow - actors left, surfaces mid, memory panel right.

const P = 'mmd2';

export function MemoryMapV2(): React.JSX.Element {
  return (
    <GridWrap>
      <svg
        viewBox="0 0 940 520"
        width="100%"
        style={{ maxWidth: 940 }}
        fontFamily="var(--font-sans, system-ui, sans-serif)"
        role="img"
        aria-label="Left to right: your tools, the doors in, the one memory behind them"
      >
        <MapDefs idp={P} />

        <rect {...NODE} x="40" y="40" width="250" height="130" rx="10" />
        <text {...T} x="165" y="63" textAnchor="middle" fontSize="11.5">
          Your AI assistants
        </text>
        <Chip idp={P} x={56} y={76} w={80} icon="claude" label="Claude" iconScale={0.5} />
        <Chip idp={P} x={142} y={76} w={86} icon="gpt" label="ChatGPT" />
        <Chip idp={P} x={56} y={104} w={80} icon="cursor" label="Cursor" />
        <Chip idp={P} x={142} y={104} w={86} icon="vscode" label="VS Code" />
        <Chip idp={P} x={56} y={132} w={80} icon="grok" label="Grok" iconScale={0.5} />
        <Chip idp={P} x={142} y={132} w={86} icon="claude" label="Code" iconScale={0.42} />

        <rect {...NODE} x="40" y="210" width="250" height="66" rx="10" />
        <text {...T} x="165" y="234" textAnchor="middle" fontSize="11.5">
          Your scripts &amp; CI
        </text>
        <Chip idp={P} x={103} y={244} w={124} icon="term" label="curl · pipelines" />

        <rect {...NODE} x="40" y="316" width="250" height="90" rx="10" />
        <text {...T} x="165" y="340" textAnchor="middle" fontSize="11.5">
          Your files
        </text>
        <Chip idp={P} x={70} y={352} w={94} icon="obsidian" label="Obsidian" />
        <Chip idp={P} x={172} y={352} w={56} icon="term" label="CLI" iconScale={0.5} />
        <text {...S} x="165" y="394" textAnchor="middle">
          plain .md on your disk
        </text>

        <rect {...HOT} x="400" y="60" width="230" height="86" rx="10" />
        <text {...T} x="515" y="88" textAnchor="middle">
          MCP server
        </text>
        <text {...M} x="515" y="105" textAnchor="middle">
          memory.agentage.io/mcp
        </text>
        <text {...S} x="515" y="122" textAnchor="middle">
          where your AIs connect
        </text>

        <rect {...HOT} x="400" y="212" width="230" height="66" rx="10" />
        <text {...T} x="515" y="238" textAnchor="middle">
          REST API
        </text>
        <text {...M} x="515" y="255" textAnchor="middle">
          api.agentage.io/v1
        </text>

        <rect {...HOT} x="400" y="322" width="230" height="80" rx="10" />
        <text {...T} x="515" y="348" textAnchor="middle">
          Sync
        </text>
        <text {...S} x="515" y="366" textAnchor="middle">
          keeps every device up to date
        </text>
        <text {...S} x="515" y="381" textAnchor="middle">
          works offline
        </text>

        <rect
          x="720"
          y="60"
          width="180"
          height="342"
          rx="14"
          fill="var(--color-primary)"
          fillOpacity="0.09"
          stroke="var(--color-primary)"
          strokeOpacity="0.5"
          strokeWidth="1.4"
        />
        <path
          d="M 810 174 C 806.5 167 796 168 796 176 C 796 183 803 187.5 810 193 C 817 187.5 824 183 824 176 C 824 168 813.5 167 810 174 Z"
          fill="var(--color-primary)"
        />
        <text {...T} x="810" y="215" textAnchor="middle" fontSize="15">
          Your memory
        </text>
        <text {...S} x="810" y="238" textAnchor="middle">
          every note, one place
        </text>
        <text {...S} x="810" y="262" textAnchor="middle">
          plain markdown
        </text>
        <text {...S} x="810" y="280" textAnchor="middle">
          EU-hosted
        </text>
        <text {...S} x="810" y="298" textAnchor="middle">
          export anytime
        </text>

        <path {...EDGE} d="M290 105 H 396" markerEnd={`url(#${P}-ar)`} />
        <text {...LBL} x="306" y="97">
          chat - read &amp; write notes
        </text>
        <path {...EDGE} d="M290 244 H 396" markerEnd={`url(#${P}-ar)`} />
        <text {...LBL} x="316" y="236">
          HTTPS + token
        </text>
        <path {...EDGE} d="M290 355 H 396" markerEnd={`url(#${P}-ar)`} />
        <path {...EDGE} d="M396 370 H 290" markerEnd={`url(#${P}-ar)`} />
        <text {...LBL} x="308" y="347">
          syncs both ways
        </text>

        <path {...EDGE} d="M630 103 H 716" markerEnd={`url(#${P}-ar)`} />
        <path {...EDGE} d="M630 245 H 716" markerEnd={`url(#${P}-ar)`} />
        <path {...EDGE} d="M630 362 H 716" markerEnd={`url(#${P}-ar)`} />

        <rect {...NODE} x="400" y="440" width="230" height="50" rx="10" strokeDasharray="5 4" />
        <text {...T} x="515" y="461" textAnchor="middle" fontSize="11">
          One sign-in for everything
        </text>
        <text {...S} x="515" y="477" textAnchor="middle">
          OAuth 2.1 · no API keys
        </text>
        <path {...EDGE} d="M515 440 V 406" strokeDasharray="4 4" markerEnd={`url(#${P}-ar)`} />
      </svg>
    </GridWrap>
  );
}
