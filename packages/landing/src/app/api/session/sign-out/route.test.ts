import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';
import * as auth from '@/lib/auth';

const CLEAR_COOKIE =
  '__Secure-better-auth.session_token=; Max-Age=0; Domain=.agentage.io; Path=/; Secure; HttpOnly';

function signOutReq(origin: string, cookie = 'sess=1'): Request {
  return new Request('https://agentage.io/api/session/sign-out', {
    method: 'POST',
    headers: { origin, cookie },
  });
}

describe('POST /api/session/sign-out', () => {
  const env = { ...process.env };

  beforeEach(() => {
    process.env.AUTH_URL = 'https://auth.agentage.io';
    delete process.env.SITE_FQDN;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = { ...env };
  });

  it('403 on a foreign Origin, without touching the AS', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const res = await POST(signOutReq('https://evil.example.com'));
    expect(res.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('forwards the cookie and relays the AS Set-Cookie clear', async () => {
    const upstream = {
      ok: true,
      headers: { getSetCookie: () => [CLEAR_COOKIE] },
    } as unknown as Response;
    const fetchMock = vi.fn().mockResolvedValue(upstream);
    vi.stubGlobal('fetch', fetchMock);

    const res = await POST(signOutReq('https://agentage.io'));
    expect(res.status).toBe(200);
    expect(res.headers.getSetCookie()).toEqual([CLEAR_COOKIE]);
    expect(res.headers.get('cache-control')).toBe('no-store');

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://auth.agentage.io/api/auth/sign-out');
    expect((init as RequestInit).method).toBe('POST');
    expect((init as RequestInit).headers).toMatchObject({
      cookie: 'sess=1',
      origin: 'https://auth.agentage.io',
    });
  });

  it('evicts the cached session token on a successful sign-out only', async () => {
    const evict = vi.spyOn(auth, 'evictSession');
    const ok = { ok: true, headers: { getSetCookie: () => [] } } as unknown as Response;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ...ok, ok: false }));
    await POST(signOutReq('https://agentage.io', 'sess=9'));
    expect(evict).not.toHaveBeenCalled();

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok));
    await POST(signOutReq('https://agentage.io', 'sess=9'));
    expect(evict).toHaveBeenCalledWith('sess=9');
    evict.mockRestore();
  });
});
