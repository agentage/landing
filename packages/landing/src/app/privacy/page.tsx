import type { Metadata } from 'next';
import { LegalShell } from '../legal-shell';
import { CONTACT_EMAIL } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Agentage Memory collects, stores, and protects your data. EU-resident, files-first, yours to export anytime.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="29 May 2026">
      <p>
        Agentage Memory is the shared memory layer for your AI tools. This policy explains what we
        collect, why, where it lives, and the control you keep over it. Our guiding principle is
        simple: <strong>your memory is owned by you</strong>, stored in your own per-tenant store
        and mirrored as plain files you can export at any time.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Waitlist</strong> - your email address and, optionally, which AI tools you use.
          When you sign up we may also record basic technical and source information - your IP
          address, browser and device (user-agent), the page that referred you, and any campaign
          tags (UTM) - to gauge demand and prevent abuse, not to profile you.
        </li>
        <li>
          <strong>Account</strong> - when accounts open, the identifier from your chosen sign-in
          (GitHub, Google, or Microsoft) and basic profile details that provider returns.
        </li>
        <li>
          <strong>Your memory content</strong> - the notes your AI tools read and write through the
          MCP endpoint. This is your data; we process it to provide sync and search, not to profile
          you.
        </li>
        <li>
          <strong>Operational logs</strong> - minimal request and error logs needed to run and
          secure the service.
        </li>
      </ul>

      <h2>How we use it</h2>
      <p>
        To operate the service: store and sync your memory, return search results, authenticate you,
        send service messages, and keep the system secure and reliable. We do not sell your data,
        and we do not use your memory content to train models.
      </p>

      <h2>Where your data lives</h2>
      <p>
        Your canonical store and our index run on{' '}
        <strong>EU-based cloud infrastructure (Germany)</strong>, EU-resident by architecture. A
        local markdown mirror lives on your own machines. You can export your full memory as plain
        files at any time.
      </p>

      <h2>Sub-processors</h2>
      <p>We rely on a small set of providers, each handling a specific function:</p>
      <ul>
        <li>
          <strong>EU cloud infrastructure (Germany)</strong> - compute and storage.
        </li>
        <li>
          <strong>Anthropic (US)</strong> - LLM tool-calling pass-through; not used to train models.
        </li>
        <li>
          <strong>Resend (EU routing)</strong> - authentication and service email.
        </li>
        <li>
          <strong>Stripe (Ireland)</strong> - payment processing for paid plans.
        </li>
        <li>
          <strong>Google (US)</strong> - Google Analytics, to measure marketing-site usage.
        </li>
      </ul>

      <h2>Google API Services</h2>
      <p>
        Agentage Memory&apos;s use and transfer of information received from Google APIs adheres to
        the{' '}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements. We use Google sign-in only to authenticate you; we
        do not transfer or use Google user data for advertising, and we do not use it to train
        models.
      </p>

      <h2>Your rights</h2>
      <p>
        Under the GDPR you can access, correct, export, or delete your personal data, and object to
        or restrict certain processing. Because your memory mirrors to files you hold, export and
        deletion are built in. To exercise any right, contact us below.
      </p>

      <h2>Retention</h2>
      <p>
        We keep your data while your account is active. Delete a memory or your account and the
        corresponding data is removed from our store; you keep your local files.
      </p>

      <h2>Cookies &amp; analytics</h2>
      <p>
        The marketing site uses essential cookies plus Google Analytics to understand aggregate
        usage (pages viewed, sign-up conversions). We do not run advertising trackers and do not
        sell this data. The app itself sets only the cookies needed to keep you signed in.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or requests: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalShell>
  );
}
