import type { Metadata } from 'next';
import { LegalShell } from '../legal-shell';
import { CONTACT_EMAIL } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms for using Agentage Memory - the shared memory layer for every AI.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="29 May 2026">
      <p>
        These terms govern your use of Agentage Memory (the &ldquo;Service&rdquo;). By using the
        Service or joining the waitlist, you agree to them.
      </p>

      <h2>The service</h2>
      <p>
        Agentage Memory is a shared memory layer your AI tools read and write through a single MCP
        endpoint, with your data stored in your own per-tenant store and mirrored as plain files.
        The Service is under active development; features may change, and early access may be
        offered as a beta.
      </p>

      <h2>Accounts</h2>
      <p>
        You sign in through a third-party provider (GitHub, Google, or Microsoft). You are
        responsible for activity under your account and for keeping your sign-in secure.
      </p>

      <h2>Your content and ownership</h2>
      <p>
        <strong>You own your memory and its content.</strong> You grant us only the limited
        permission needed to store, sync, index, and return it to you and the tools you connect. We
        claim no ownership of your data and do not use it to train models. You can export or delete
        it at any time.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Do not use the Service to break the law, infringe others&rsquo; rights, attempt to disrupt
        or gain unauthorized access to the system, or store content you have no right to store.
      </p>

      <h2>Plans and billing</h2>
      <p>
        Paid plans, where offered, are billed through our payment processor under the pricing shown
        at sign-up. A free tier is available. Beta access may be free or discounted and is provided
        without guarantees.
      </p>

      <h2>Disclaimers</h2>
      <p>
        The Service is provided &ldquo;as is&rdquo; without warranties of any kind. We do not
        guarantee uninterrupted or error-free operation. Keep your own copies - your local files are
        yours precisely so you are never dependent on us.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, Agentage is not liable for indirect, incidental, or
        consequential damages, or for loss of data, arising from your use of the Service.
      </p>

      <h2>Termination</h2>
      <p>
        You may stop using the Service and delete your account at any time. We may suspend or
        terminate access for breach of these terms or to protect the Service.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms as the Service evolves. Material changes will be reflected in the
        &ldquo;last updated&rdquo; date above, and where appropriate we will notify you.
      </p>

      <h2>Contact</h2>
      <p>
        Questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalShell>
  );
}
