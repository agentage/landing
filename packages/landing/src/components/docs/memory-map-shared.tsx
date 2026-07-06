import * as React from 'react';

// Shared SVG bits for the overview memory-map variants: brand icon defs
// (prefixed ids so several variants can coexist on one page) + style constants
// mapped to theme variables so light and dark both work.

export const NODE = {
  fill: 'var(--color-card)',
  stroke: 'var(--color-border)',
  strokeWidth: 1.2,
} as const;

export const HOT = {
  fill: 'var(--color-card)',
  stroke: 'var(--color-primary)',
  strokeOpacity: 0.55,
  strokeWidth: 1.3,
} as const;

export const T = { fill: 'var(--color-foreground)', fontSize: 12.5, fontWeight: 650 } as const;
export const S = { fill: 'var(--color-muted-foreground)', fontSize: 10 } as const;
export const LBL = { fill: 'var(--color-muted-foreground)', fontSize: 9 } as const;
export const M = {
  fill: 'var(--color-primary)',
  fontFamily: 'var(--font-mono, ui-monospace, Menlo, monospace)',
  fontSize: 9.5,
} as const;
export const EDGE = {
  stroke: 'var(--color-primary)',
  strokeOpacity: 0.8,
  strokeWidth: 1.3,
  fill: 'none',
} as const;
export const CHIP = {
  fill: 'var(--color-background)',
  stroke: 'var(--color-border)',
  strokeWidth: 1,
} as const;
export const CT = {
  fill: 'var(--color-foreground)',
  fillOpacity: 0.85,
  fontSize: 9,
  fontWeight: 600,
} as const;

export function GridWrap({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div
      className="rounded-xl border border-border p-2"
      style={{
        backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      {children}
    </div>
  );
}

export function MapDefs({ idp }: { idp: string }): React.JSX.Element {
  return (
    <defs>
      <marker
        id={`${idp}-ar`}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L10 5 L0 10 z" fill="var(--color-primary)" />
      </marker>
      <g id={`${idp}-ic-claude`} stroke="#D97757" strokeWidth="2.4" strokeLinecap="round">
        <line y1="-7" y2="7" />
        <line x1="-7" x2="7" />
        <line x1="-5" y1="-5" x2="5" y2="5" />
        <line x1="-5" y1="5" x2="5" y2="-5" />
      </g>
      <g id={`${idp}-ic-gpt`} stroke="#5fb89e" strokeWidth="2" fill="none">
        <path d="M 0 -8 L 6.9 -4 L 6.9 4 L 0 8 L -6.9 4 L -6.9 -4 Z" />
        <path d="M 0 -8 L 0 0 L 6.9 4 M 0 0 L -6.9 4" />
      </g>
      <g id={`${idp}-ic-vscode`}>
        <path
          d="M 7 -8 L 7 8 L 1.5 3.4 L -3.5 7.2 L -6 5.6 L -1.4 0 L -6 -5.6 L -3.5 -7.2 L 1.5 -3.4 Z"
          fill="#3fa7f0"
        />
      </g>
      <g id={`${idp}-ic-cursor`}>
        <path d="M 0 -8 L 7 -4 L 7 4 L 0 8 L -7 4 L -7 -4 Z" fill="#b9bfca" />
        <path d="M 0 -8 L 7 -4 L 0 0 L -7 -4 Z" fill="#818a99" />
        <path d="M 0 0 L 7 -4 L 7 4 L 0 8 Z" fill="#9aa2b1" />
      </g>
      <g
        id={`${idp}-ic-grok`}
        stroke="var(--color-foreground)"
        strokeWidth="2.2"
        strokeLinecap="round"
      >
        <path d="M -6 6.5 L 5.5 -7" fill="none" />
        <path d="M -1.5 6.5 L 7 -3.5" fill="none" />
      </g>
      <g id={`${idp}-ic-obsidian`}>
        <path d="M 0 -8 L 6 -3.2 L 4.2 8 L -4.2 8 L -6 -3.2 Z" fill="#7c5cff" />
        <path d="M 0 -8 L 6 -3.2 L 1.2 8 L -1 0 Z" fill="#a08dff" />
      </g>
      <g id={`${idp}-ic-term`}>
        <rect
          x="-8"
          y="-7"
          width="16"
          height="14"
          rx="3"
          fill="none"
          stroke="#4fae66"
          strokeWidth="1.6"
        />
        <text
          x="-4.5"
          y="3.5"
          fontSize="9"
          fill="#4fae66"
          fontWeight="700"
          fontFamily="var(--font-mono, ui-monospace, Menlo, monospace)"
        >
          {'>_'}
        </text>
      </g>
    </defs>
  );
}

export function Chip({
  x,
  y,
  w,
  icon,
  label,
  idp,
  iconScale = 0.55,
}: {
  x: number;
  y: number;
  w: number;
  icon: string;
  label: string;
  idp: string;
  iconScale?: number;
}): React.JSX.Element {
  return (
    <g>
      <rect {...CHIP} x={x} y={y} width={w} height={22} rx={11} />
      <use
        href={`#${idp}-ic-${icon}`}
        transform={`translate(${x + 14},${y + 11}) scale(${iconScale})`}
      />
      <text {...CT} x={x + 24} y={y + 15}>
        {label}
      </text>
    </g>
  );
}
