'use client';

import { useState } from 'react';
import { Button, LiquidButton, MetalButton } from "@/components/ui/button";
import { School, Sparkles, AlertCircle, ArrowRight, ShieldAlert, Settings } from 'lucide-react';
import Link from 'next/link';
import { Role } from '@/lib/mock-db';
import { setClientSession } from '@/lib/auth-session';
import { cn } from '@/lib/utils';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDevMode, setShowDevMode] = useState(false);

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all details.');
      return;
    }

    setLoading(true);
    
    // Simulate lookup: match predefined roles or default to Super Admin
    setTimeout(() => {
      setLoading(false);
      let targetRole: Role = 'SUPER_ADMIN';
      
      const emailLower = email.toLowerCase();
      if (emailLower.includes('counsellor')) {
        targetRole = 'COUNSELLOR';
      } else if (emailLower.includes('faculty')) {
        targetRole = 'FACULTY';
      } else if (emailLower.includes('student')) {
        targetRole = 'STUDENT';
      } else if (emailLower.includes('parent')) {
        targetRole = 'PARENT';
      }
      
      setClientSession(targetRole);
    }, 800);
  };

  const handleQuickSimulation = (role: Role) => {
    setLoading(true);
    setTimeout(() => {
      setClientSession(role);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-white relative">
      {/* Dev Mode Toggle Gear */}
      <button
        onClick={() => setShowDevMode(!showDevMode)}
        className="absolute top-6 right-6 p-2 text-zinc-600 hover:text-emerald-400 hover:bg-zinc-900/50 rounded-lg transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider z-50 select-none"
        title="Toggle Developer Options"
      >
        <Settings className={cn("h-4 w-4", showDevMode ? "animate-spin" : "")} />
        <span>{showDevMode ? "Production Mode" : "Developer View"}</span>
      </button>

      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 h-[400px] w-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className={cn(
        "w-full items-stretch transition-all duration-300",
        showDevMode ? "max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8" : "max-w-md flex flex-col"
      )}>
        
        {/* Left Card: Form */}
        <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between relative z-10 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <School className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-white uppercase tracking-wider block">Sri Gowthami</span>
                <span className="text-[9px] text-zinc-500 font-medium">Educational Group</span>
              </div>
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">Access Console</h1>
              <p className="text-zinc-400 text-xs mt-1">
                {showDevMode 
                  ? "Sign in with credentials, or use simulation quick dials on the right." 
                  : "Sign in to access your student, parent, or faculty portal."
                }
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleStandardSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. counsellor.rama@gowthami.edu"
                  className="w-full glass-input rounded-lg p-2.5 text-xs text-white placeholder-zinc-600 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input rounded-lg p-2.5 text-xs text-white placeholder-zinc-600 outline-none transition-colors"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/10"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>

          <div className="pt-4 border-t border-zinc-900/40 flex justify-between items-center text-[10px] text-zinc-500">
            <Link href="/" className="hover:text-zinc-400 font-medium">← Back to Home</Link>
            {showDevMode && <span>Sandbox Session v1.0</span>}
          </div>
        </div>

        {/* Right Card: Quick simulation selections */}
        {showDevMode && (
          <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between relative z-10 border-amber-500/15 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs border-b border-zinc-900/40 pb-3">
                <ShieldAlert className="h-4.5 w-4.5" />
                <span>Developer Quick Simulation logins</span>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Bypass OAuth flow in this offline sandbox. Click on any profile card below to assume their database roles instantly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <Button
                  onClick={() => handleQuickSimulation('SUPER_ADMIN')}
                  className="p-3 text-left rounded-lg glass-inner-card transition-colors flex flex-col gap-0.5"
                >
                  <span className="text-xs font-semibold text-emerald-400">Super Admin</span>
                  <span className="text-[9px] text-zinc-500">Director View (Sri Devi)</span>
                </Button>

                <Button
                  onClick={() => handleQuickSimulation('COUNSELLOR')}
                  className="p-3 text-left rounded-lg glass-inner-card transition-colors flex flex-col gap-0.5"
                >
                  <span className="text-xs font-semibold text-blue-400">Counsellor Desk</span>
                  <span className="text-[9px] text-zinc-500">CRM & remarks (Rama Rao)</span>
                </Button>

                <Button
                  onClick={() => handleQuickSimulation('FACULTY')}
                  className="p-3 text-left rounded-lg glass-inner-card transition-colors flex flex-col gap-0.5"
                >
                  <span className="text-xs font-semibold text-amber-400">Faculty Staff</span>
                  <span className="text-[9px] text-zinc-500">Campuses & approvals</span>
                </Button>

                <Button
                  onClick={() => handleQuickSimulation('STUDENT')}
                  className="p-3 text-left rounded-lg glass-inner-card transition-colors flex flex-col gap-0.5"
                >
                  <span className="text-xs font-semibold text-purple-400">Student Profile</span>
                  <span className="text-[9px] text-zinc-500">File uploads (Aditya Varma)</span>
                </Button>

                <Button
                  onClick={() => handleQuickSimulation('PARENT')}
                  className="p-3 text-left rounded-lg glass-inner-card transition-colors flex flex-col gap-0.5 sm:col-span-2"
                >
                  <span className="text-xs font-semibold text-rose-400">Parent Portal</span>
                  <span className="text-[9px] text-zinc-500">Ward progression tracker (Srinivas Varma)</span>
                </Button>
              </div>
            </div>

            <div className="pt-4 text-center text-[9px] text-zinc-600">
              Offline Sandbox persist mode is ACTIVE.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
