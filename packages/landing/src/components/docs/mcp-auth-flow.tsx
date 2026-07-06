import * as React from 'react';
import { EDGE, GridWrap, HOT, LBL, M, MapDefs, NODE, S, T } from './memory-map-shared';

// The OAuth 2.1 connect flow for the MCP server: the client hits the resource
// server, is bounced to the authorization server to sign in, then reconnects
// with a token. Horizontal, DS-token styled, dark/light safe - see memory-map-v2.

const P = 'authflow';

export function McpAuthFlow(): React.JSX.Element {
  return (
    <GridWrap>
      <svg
        viewBox="0 0 720 300"
        width="100%"
        style={{ maxWidth: 720 }}
        fontFamily="var(--font-sans, system-ui, sans-serif)"
        role="img"
        aria-label="OAuth 2.1 connect flow: MCP client to the memory resource server (401 with protected resource metadata), to auth.agentage.io to register and sign in, back with a token, then an authorized MCP session"
      >
        <MapDefs idp={P} />

        {/* MCP client */}
        <rect {...NODE} x="24" y="112" width="150" height="76" rx="10" />
        <text {...T} x="99" y="144" textAnchor="middle" fontSize="12">
          MCP client
        </text>
        <text {...S} x="99" y="163" textAnchor="middle">
          Claude · Cursor
        </text>
        <text {...S} x="99" y="177" textAnchor="middle">
          VS Code
        </text>

        {/* Resource server */}
        <rect {...HOT} x="270" y="22" width="192" height="80" rx="10" />
        <text {...T} x="366" y="50" textAnchor="middle" fontSize="11.5">
          MCP resource server
        </text>
        <text {...M} x="366" y="68" textAnchor="middle">
          memory.agentage.io/mcp
        </text>
        <text {...S} x="366" y="86" textAnchor="middle">
          Streamable HTTP
        </text>

        {/* Authorization server */}
        <rect {...HOT} x="270" y="198" width="192" height="80" rx="10" />
        <text {...T} x="366" y="226" textAnchor="middle" fontSize="11.5">
          Authorization server
        </text>
        <text {...M} x="366" y="244" textAnchor="middle">
          auth.agentage.io
        </text>
        <text {...S} x="366" y="262" textAnchor="middle">
          OAuth 2.1 · PKCE · DCR
        </text>

        {/* Authorized session */}
        <rect
          x="546"
          y="112"
          width="150"
          height="76"
          rx="10"
          fill="var(--color-primary)"
          fillOpacity="0.09"
          stroke="var(--color-primary)"
          strokeOpacity="0.5"
          strokeWidth="1.4"
        />
        <text {...T} x="621" y="144" textAnchor="middle" fontSize="12">
          Authorized session
        </text>
        <text {...S} x="621" y="163" textAnchor="middle">
          read + write
        </text>
        <text {...S} x="621" y="177" textAnchor="middle">
          your memory
        </text>

        {/* 1: client -> resource server (connect) */}
        <path {...EDGE} d="M174 132 L268 62" markerEnd={`url(#${P}-ar)`} />
        <text {...LBL} x="182" y="92">
          1 · connect (no token)
        </text>

        {/* 2: resource server -> client (401 + PRM) */}
        <path {...EDGE} d="M268 82 L174 146" markerEnd={`url(#${P}-ar)`} />
        <text {...LBL} x="178" y="126">
          2 · 401 + resource metadata
        </text>

        {/* 3: client -> auth server (register + PKCE + sign in) */}
        <path {...EDGE} d="M174 168 L268 236" markerEnd={`url(#${P}-ar)`} />
        <text {...LBL} x="180" y="204">
          3 · register + PKCE + sign in
        </text>

        {/* 4: auth server -> client (access token) */}
        <path {...EDGE} d="M268 256 L174 184" markerEnd={`url(#${P}-ar)`} />
        <text {...LBL} x="182" y="240">
          4 · access token
        </text>

        {/* 5: client -> authorized session (reconnect with token) */}
        <path {...EDGE} d="M174 156 H 542" markerEnd={`url(#${P}-ar)`} />
        <text {...LBL} x="300" y="148">
          5 · reconnect with Bearer token
        </text>
      </svg>
    </GridWrap>
  );
}
