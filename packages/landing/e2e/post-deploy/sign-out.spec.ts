import { test, expect } from '@playwright/test';

type SessionBody = { user: { email: string } | null };

test.describe('Landing - sign-out (live)', { tag: '@post-deploy' }, () => {
  test('sign out clears the session in the browser and revokes it server-side', async ({
    page,
    context,
    request,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Account menu' }).click();
    await expect(page.getByRole('menu')).toContainText('@agentage.test');

    const oldCookie = (await context.cookies())
      .filter((c) => c.name.includes('session_token'))
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');
    expect(oldCookie, 'browser carries the session cookie').not.toBe('');

    const signOut = page.waitForResponse(
      (r) => r.url().endsWith('/api/session/sign-out') && r.request().method() === 'POST'
    );
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    expect((await signOut).status(), 'sign-out proxy (502 = AS rejected it)').toBe(200);

    await page.waitForLoadState('load');
    await expect(page.getByRole('link', { name: 'Sign in' }).first()).toBeVisible();
    const live = await page.request.get('/api/session');
    expect(((await live.json()) as SessionBody).user).toBeNull();

    // Replay the pre-sign-out cookie: a client-side clear alone would still resolve a user.
    const replay = await request.get('/api/session', { headers: { cookie: oldCookie } });
    expect(((await replay.json()) as SessionBody).user, 'old cookie revoked').toBeNull();
  });
});
