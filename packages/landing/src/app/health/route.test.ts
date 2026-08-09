import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GET } from './route';

const ENV_KEYS = ['OTEL_SERVICE_NAME', 'COMMIT_SHA', 'BUILD_TIME'] as const;
const original: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};

beforeEach(() => {
  for (const key of ENV_KEYS) original[key] = process.env[key];
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (original[key] === undefined) delete process.env[key];
    else process.env[key] = original[key];
  }
});

describe('GET /health', () => {
  it('returns the v1 envelope', async () => {
    process.env.OTEL_SERVICE_NAME = 'agentage-landing';
    process.env.COMMIT_SHA = 'eb3c09e5cfcdad03d09fb76a8b4a4b49a953374c';
    process.env.BUILD_TIME = '';

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(body.success).toBe(true);
    expect(body.data.service).toBe('agentage-landing');
    // 7-char short form; the full sha lives in `version` (estate contract H12).
    expect(body.data.commit).toBe('eb3c09e');
    expect(body.data.version).toBe('eb3c09e5cfcdad03d09fb76a8b4a4b49a953374c');
    // `||`, not `??`: a blank BUILD_TIME must read as null, never "" (defect H2).
    expect(body.data.buildTime).toBeNull();
    expect(typeof body.data.startedAt).toBe('string');
    expect(typeof body.data.uptimeSeconds).toBe('number');
  });
});
