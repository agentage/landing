import { describe, expect, it } from 'vitest';
import { deriveAuthBase } from './auth';

describe('deriveAuthBase', () => {
  it('derives the auth sibling from a prod apex FQDN', () => {
    expect(deriveAuthBase('agentage.io')).toBe('https://auth.agentage.io');
  });

  it('keeps the dev prefix (dev.agentage.io -> auth.dev.agentage.io)', () => {
    expect(deriveAuthBase('dev.agentage.io')).toBe('https://auth.dev.agentage.io');
  });

  it('tolerates a scheme / trailing slash / case on the FQDN', () => {
    expect(deriveAuthBase('https://Agentage.io/')).toBe('https://auth.agentage.io');
  });

  it('prefers an explicit AUTH_URL over the derived host', () => {
    expect(deriveAuthBase('agentage.io', 'https://auth.example.test/')).toBe(
      'https://auth.example.test'
    );
  });

  it('returns null for localhost / 127.0.0.1 / empty / .invalid (signed-out)', () => {
    for (const h of ['localhost', 'localhost:3000', '127.0.0.1', '', undefined, 'x.invalid']) {
      expect(deriveAuthBase(h)).toBeNull();
    }
  });
});
