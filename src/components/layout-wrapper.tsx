'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getClientSession } from '@/lib/auth-session';

// Lazy-load heavy client components to reduce initial bundle size
const DashboardNav = dynamic(() => import('./dashboard-nav'), { ssr: false });
const MainHeader = dynamic(() => import('./main-header'), { ssr: false });
const ChatbotWindow = dynamic(() => import('./chatbot-window'), { ssr: false });

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages that should NOT render the dashboard sidebar and header shell
  const isPublicPage = pathname === '/' || pathname.startsWith('/auth');

  if (isPublicPage) {
    return children;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Shell */}
      <DashboardNav />

      {/* Main viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <MainHeader />

        {/* Content Box */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Floating Admissions chatbot bot */}
      <ChatbotWindow />
    </div>
  );
}
