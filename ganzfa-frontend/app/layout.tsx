import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GANZ-FA Felvételi Portál',
  description: 'Diákoknak a felvételi eredmények megtekintéséhez',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body className="bg-slate-50 font-sans">{children}</body>
    </html>
  );
}
