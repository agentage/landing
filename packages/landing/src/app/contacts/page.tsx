import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT_EMAIL, GITHUB_URL } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Contact - Agentage Memory',
  description:
    'Get in touch with the Agentage Memory team - questions, feedback, or security reports.',
  alternates: { canonical: '/contacts' },
};

export default function ContactsPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-20 md:pb-24">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Contact</h1>
      <div className="mt-10 space-y-5 text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_strong]:text-foreground">
        <p>
          Questions, feedback, or anything else about Agentage Memory - we read every message and
          reply to most within a day.
        </p>

        <h2>General</h2>
        <p>
          Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> for product questions,
          feedback, billing, or data requests.
        </p>

        <h2>Connect</h2>
        <p>
          Agentage Memory is built by Volodymyr Vreshch. Connect on{' '}
          <a href="https://www.linkedin.com/in/vreshch" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>{' '}
          or find more ways to reach me at{' '}
          <a href="https://vreshch.com/contacts" target="_blank" rel="noopener noreferrer">
            vreshch.com
          </a>
          .
        </p>

        <h2>Security</h2>
        <p>
          Found a vulnerability? Report it privately to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Please do not open a public issue
          for security reports.
        </p>

        <h2>GitHub</h2>
        <p>
          Follow development or open an issue at{' '}
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            github.com/agentage
          </a>
          .
        </p>
      </div>
      <Link
        href="/"
        className="mt-12 inline-block text-sm text-primary underline underline-offset-4 hover:text-primary/80"
      >
        ← Back home
      </Link>
    </section>
  );
}
