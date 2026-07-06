import { describe, expect, it } from 'vitest';
import { catalogFavoritesUrl, signInHref } from './session';

describe('catalogFavoritesUrl', () => {
  it('derives the sibling catalog favorites URL from a prod apex host', () => {
    expect(catalogFavoritesUrl('agentage.io')).toBe('https://catalog.agentage.io/mcp/favorites');
  });

  it('keeps the dev prefix (dev.agentage.io -> catalog.dev.agentage.io)', () => {
    expect(catalogFavoritesUrl('dev.agentage.io')).toBe(
      'https://catalog.dev.agentage.io/mcp/favorites'
    );
  });

  it('normalizes case + whitespace', () => {
    expect(catalogFavoritesUrl('  Agentage.IO ')).toBe('https://catalog.agentage.io/mcp/favorites');
  });

  it('falls back to the local catalog for localhost / 127.0.0.1 / empty', () => {
    for (const h of ['localhost', '127.0.0.1', '']) {
      expect(catalogFavoritesUrl(h)).toBe('http://localhost:3000/mcp/favorites');
    }
  });
});

describe('signInHref', () => {
  it('returns the bare base when there is no window (SSR)', () => {
    expect(signInHref('https://auth.agentage.io/sign-in')).toBe('https://auth.agentage.io/sign-in');
  });
});
