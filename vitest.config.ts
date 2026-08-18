import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/*/src/**/*.test.ts', 'packages/*/src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      include: ['packages/*/src/**/*.{ts,tsx}'],
      exclude: ['**/*.test.{ts,tsx}', '**/dist/**', '**/dev/**'],
      // Floors are today's measured values minus 1 - a ratchet, not the goal;
      // the house target is 70 across the board.
      thresholds: {
        branches: 11,
        functions: 14,
        lines: 13,
        statements: 13,
      },
    },
  },
});
