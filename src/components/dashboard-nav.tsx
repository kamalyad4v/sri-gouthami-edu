'use client';

import Link from 'next/link';
import { Button, LiquidButton, MetalButton } from "@/components/ui/button";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getClientSession, UserSession } from '@/lib/auth-session';
import {
  LayoutDashboard,
  Users,
  FileText,
  School,
  BookOpen,
  Briefcase,
  TrendingUp,
  Settings,
  GraduationCap,
  Menu,
  X,
  LogOut
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  allowedRoles: string[];
}

const NAV_ITEMS: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, allowedRoles: ['SUPER_ADMIN', 'COUNSELLOR', 'FACULTY', 'STUDENT', 'PARENT'] },
  { name: 'CRM Leads', href: '/leads', icon: Users, allowedRoles: ['SUPER_ADMIN', 'COUNSELLOR'] },
  { name: 'Applications', href: '/applications', icon: FileText, allowedRoles: ['SUPER_ADMIN', 'COUNSELLOR', 'FACULTY', 'STUDENT', 'PARENT'] },
  { name: 'Campuses', href: '/campuses', icon: School, allowedRoles: ['SUPER_ADMIN', 'FACULTY'] },
  { name: 'Programs', href: '/programs', icon: GraduationCap, allowedRoles: ['SUPER_ADMIN', 'FACULTY', 'COUNSELLOR'] },
  { name: 'Course Catalog', href: '/courses', icon: BookOpen, allowedRoles: ['SUPER_ADMIN', 'COUNSELLOR', 'FACULTY', 'STUDENT'] },
  { name: 'Counsellor Desk', href: '/counsellors', icon: Briefcase, allowedRoles: ['SUPER_ADMIN', 'COUNSELLOR'] },
  { name: 'Reports Compiler', href: '/reports', icon: TrendingUp, allowedRoles: ['SUPER_ADMIN', 'FACULTY', 'COUNSELLOR'] },
  { name: 'Portal Settings', href: '/settings', icon: Settings, allowedRoles: ['SUPER_ADMIN'] },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const [session, setSession] = useState<UserSession | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setSession(getClientSession());
    // Listen for role changes via storage event (no polling needed)
    const handleRoleChange = (e: StorageEvent) => {
      if (e.key === 'sg_role') {
        setSession(getClientSession());
      }
    };
    window.addEventListener('storage', handleRoleChange);
    return () => window.removeEventListener('storage', handleRoleChange);
  }, []);

  if (!session) return null;

  const allowedItems = NAV_ITEMS.filter(item => item.allowedRoles.includes(session.role));

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* Logo Banner */}
        <div className="flex items-center gap-2.5 px-2.5 py-1.5 border-b border-zinc-900/40 pb-4">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <School className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xs text-white uppercase tracking-wider block leading-none">Sri Gowthami</span>
            <span className="text-[9px] text-zinc-500 font-medium">Admissions Console</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {allowedItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 border",
                  isActive
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 font-bold"
                    : "bg-transparent border-transparent text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-emerald-400")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile */}
      <div className="border-t border-zinc-900/40 pt-4 mt-auto">
        <div className="flex items-center gap-3 p-1.5 rounded-lg glass-inner-card">
          <div className="h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-[10px] font-bold text-emerald-400 uppercase shrink-0">
            {session.name.substring(0, 2)}
          </div>
          <div className="overflow-hidden flex-1">
            <span className="font-semibold text-xs text-zinc-200 block truncate">{session.name}</span>
            <span className="text-[10px] text-zinc-500 block truncate uppercase tracking-wider font-bold">{session.role.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between glass-header px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-emerald-600 flex items-center justify-center">
            <School className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-xs text-white uppercase tracking-wider">Sri Gowthami</span>
        </div>
        <Button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-zinc-400 hover:text-white p-1"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:block w-64 glass-sidebar p-4 h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Sidebar Mobile Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 glass-modal-overlay" onClick={() => setIsMobileOpen(false)} />
          <aside className="relative w-64 max-w-xs glass-sidebar p-4 flex flex-col h-full z-50">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
