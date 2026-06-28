'use client';

import { useEffect, useState } from 'react';
import { Button, LiquidButton, MetalButton } from "@/components/ui/button";
import { getClientSession, setClientSession, UserSession } from '@/lib/auth-session';
import { Role } from '@/lib/mock-db';
import { Bell, Search, Sparkles, User, ChevronDown, Check, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MainHeader() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<HeaderNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const rolesList = [
    { role: 'SUPER_ADMIN' as Role, name: 'Super Admin', desc: 'Director View (Sri Devi)' },
    { role: 'COUNSELLOR' as Role, name: 'Counsellor Desk', desc: 'CRM & remarks (Rama Rao)' },
    { role: 'FACULTY' as Role, name: 'Faculty Staff', desc: 'Campuses & eligibility' },
    { role: 'STUDENT' as Role, name: 'Student Profile', desc: 'Certificates uploads (Aditya)' },
    { role: 'PARENT' as Role, name: 'Parent Portal', desc: 'Ward fees & status tracking' },
  ];

  const loadNotifs = async (userId: string) => {
    try {
      const res = await fetch(`/api/notifications?userId=${userId}`);
      if (res.ok) {
        const list = await res.json();
        setNotifications(list);
        setUnreadCount(list.filter((n: any) => !n.isRead).length);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    const activeSession = getClientSession();
    setSession(activeSession);
    loadNotifs(activeSession.id);

    // Listen for role changes via storage events
    const handleRoleChange = (e: StorageEvent) => {
      if (e.key === 'sg_role') {
        const newSession = getClientSession();
        setSession(newSession);
        loadNotifs(newSession.id);
      }
    };
    window.addEventListener('storage', handleRoleChange);

    // Refresh notifications periodically (30s instead of 15s)
    const interval = setInterval(() => {
      loadNotifs(getClientSession().id);
    }, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleRoleChange);
    };
  }, []);

  const handleRoleChange = (role: Role) => {
    setRoleDropdownOpen(false);
    setClientSession(role);
  };

  const handleMarkAllRead = async () => {
    if (!session) return;
    try {
      const res = await fetch(`/api/notifications?userId=${session.id}`, { method: 'POST' });
      if (res.ok) {
        loadNotifs(session.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    if (!session) return;
    try {
      const data = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error(err);
    }
  };

  if (!session) return null;

  return (
    <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
      {/* Search Console */}
      <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-500 w-80">
        <Search className="h-3.5 w-3.5 text-zinc-400" />
        <span className="text-[10px] text-zinc-500 font-medium">Search anything inside Gowthami Console...</span>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications Tray */}
        <div className="relative">
          <Button
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setRoleDropdownOpen(false);
            }}
            className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-600 hover:text-zinc-800 relative transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </Button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-xl bg-white border border-zinc-200 shadow-xl p-2 z-50">
              <div className="px-3 py-2 border-b border-zinc-200 mb-1 flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Activity Notifications</span>
                {unreadCount > 0 && (
                  <Button
                    onClick={handleMarkAllRead}
                    className="text-[9px] font-bold text-emerald-600 hover:text-emerald-700 uppercase"
                  >
                    Mark all read
                  </Button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto space-y-0.5">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-[11px] text-zinc-400">No new alerts.</div>
                ) : (
                  notifications.map(n => (
                    <Button
                      key={n.id}
                      onClick={() => handleMarkSingleRead(n.id)}
                      className={cn(
                        "w-full text-left p-2.5 rounded-lg text-xs transition-colors flex flex-col gap-0.5 hover:bg-zinc-50",
                        !n.isRead ? "bg-emerald-50 border border-emerald-100" : ""
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={cn("font-semibold text-[11px]", !n.isRead ? "text-zinc-900" : "text-zinc-500")}>
                          {n.title}
                        </span>
                        {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed mt-0.5">{n.message}</p>
                    </Button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Simulation switcher */}
        <div className="relative">
          <Button
            onClick={() => {
              setRoleDropdownOpen(!roleDropdownOpen);
              setNotifDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold tracking-wide transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Role Desk: {rolesList.find(r => r.role === session.role)?.name || session.role}</span>
            <ChevronDown className="h-3.5 w-3.5 text-emerald-500" />
          </Button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-72 rounded-xl bg-white border border-zinc-200 shadow-xl p-2 z-50">
              <div className="px-3 py-1.5 border-b border-zinc-200 mb-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Role Simulation Desk</span>
              </div>
              <div className="space-y-0.5">
                {rolesList.map(r => (
                  <Button
                    key={r.role}
                    onClick={() => handleRoleChange(r.role)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex flex-col gap-0.5 hover:bg-zinc-50",
                      session.role === r.role ? "bg-emerald-50 border border-emerald-200" : ""
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn("font-medium", session.role === r.role ? "text-emerald-700" : "text-zinc-700")}>
                        {r.name}
                      </span>
                      {session.role === r.role && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                    </div>
                    <span className="text-[10px] text-zinc-500">{r.desc}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
