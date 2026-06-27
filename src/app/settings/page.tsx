'use client';

import { useEffect, useState } from 'react';
import { Button, LiquidButton, MetalButton } from "@/components/ui/button";
import { getClientSession, UserSession } from '@/lib/auth-session';
import { Settings, ShieldAlert, RefreshCw, Trash2, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [resetting, setResetting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSession(getClientSession());
  }, []);

  const handleResetDb = async () => {
    if (!confirm('Are you sure you want to reset the mock database? All custom enquiries, documents and notes will be deleted and seed data will be restored.')) {
      return;
    }

    setResetting(true);
    setSuccess(false);
    try {
      const res = await fetch('/api/settings', { method: 'POST' });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  if (!session) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-white relative">
      {/* Title */}
      <div className="pb-4 border-b border-zinc-900">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Portal Settings <span className="text-xs text-zinc-500">Management</span>
        </h1>
        <p className="text-zinc-400 text-xs mt-0.5">Manage simulated authentication session parameters and reset the local persistent JSON sandbox.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Card */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white pb-2 border-b border-zinc-900">
            <Settings className="h-4.5 w-4.5 text-emerald-400" />
            <span>Active Operator Profile</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Operator Name</span>
              <div className="p-2.5 rounded-lg glass-input text-zinc-300 font-semibold">
                {session.name}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Active Logged Email</span>
              <div className="p-2.5 rounded-lg glass-input text-zinc-300 font-medium">
                {session.email}
              </div>
            </div>
          </div>
        </div>

        {/* Sandbox management card */}
        <div className="glass-panel p-5 rounded-xl space-y-4 border-amber-500/10">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs pb-2 border-b border-zinc-900">
            <ShieldAlert className="h-4.5 w-4.5" />
            <span>Developer Sandbox Admin Console</span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            The Gowthami Group Portal is currently running in **Mock Persistence Mode** using `/prisma/mock_db_data.json` local storage. You can wipe all changes and restore original student applications and enquiry logs below.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              onClick={handleResetDb}
              disabled={resetting}
              className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-rose-500/10"
            >
              <Trash2 className="h-4 w-4" />
              <span>{resetting ? 'Cleaning logs...' : 'Reset Sandbox Database'}</span>
            </Button>

            {success && (
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold animate-pulse">
                <CheckCircle className="h-4 w-4" />
                <span>Reset success! Refreshing portal...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
