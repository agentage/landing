import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agentage Memory · Design System',
  description: 'Component playground for @agentage/design-system.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
