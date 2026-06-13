import Link from 'next/link';
import { GITHUB_URL } from '../lib/site';

export function Footer() {
  return (
    <footer className="py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="divider-gradient mb-8" />
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Agentage. One memory. Every AI. Owned by you.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              href="/docs"
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              Docs
            </Link>
            <Link
              href="/blog"
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              Blog
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              GitHub
            </a>
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/contacts"
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
