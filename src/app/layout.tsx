import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import LayoutWrapper from '@/components/layout-wrapper';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Sri Gowthami Multi-Campus Admission Management System',
  description: 'Centralized CRM, applications tracking, document verification, and AI guidance advisor desk for educational group institutions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Animated gradient background for glassmorphism */}
        <div className="glass-bg-gradient" aria-hidden="true">
          <div className="glass-orb glass-orb-1" />
          <div className="glass-orb glass-orb-2" />
          <div className="glass-orb glass-orb-3" />
          <div className="glass-orb glass-orb-4" />
        </div>
        <div className="relative z-10">
          <LayoutWrapper>{children}</LayoutWrapper>
        </div>
      </body>
    </html>
  );
}
