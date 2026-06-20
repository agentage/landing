import { Suspense } from 'react';
import type { Metadata } from 'next';
import { UnsubscribeForm } from './unsubscribe-form';

export const metadata: Metadata = {
  title: 'Unsubscribe - AgentAge Memory',
  robots: { index: false, follow: false },
};

export default function UnsubscribePage() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-6 pb-24 md:pb-32">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Leave the waitlist</h1>
      <div className="mt-8 w-full">
        <Suspense fallback={<p className="text-center text-sm text-muted-foreground">Loading…</p>}>
          <UnsubscribeForm />
        </Suspense>
      </div>
    </section>
  );
}
