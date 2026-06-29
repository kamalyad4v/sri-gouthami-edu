'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { School, AlertCircle, ArrowRight, ShieldAlert, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { Role } from '@/lib/mock-db';
import { setClientSession } from '@/lib/auth-session';
import { cn } from '@/lib/utils';

const BackgroundGallery = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden opacity-[0.22] pointer-events-none select-none z-0 flex gap-4 p-4">
      {/* Column 1 */}
      <div className="flex-1 flex flex-col gap-4 -translate-y-12 animate-pulse" style={{ animationDuration: '6s' } as React.CSSProperties}>
        <img src="/school.png" alt="" className="w-full h-48 object-cover rounded-xl" />
        <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400" alt="" className="w-full h-64 object-cover rounded-xl" />
        <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400" alt="" className="w-full h-48 object-cover rounded-xl" />
      </div>
      {/* Column 2 */}
      <div className="flex-1 flex flex-col gap-4 translate-y-8 animate-pulse" style={{ animationDuration: '8s' } as React.CSSProperties}>
        <img src="/junior_college.png" alt="" className="w-full h-64 object-cover rounded-xl" />
        <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400" alt="" className="w-full h-48 object-cover rounded-xl" />
        <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400" alt="" className="w-full h-64 object-cover rounded-xl" />
      </div>
      {/* Column 3 */}
      <div className="flex-1 flex flex-col gap-4 -translate-y-8 animate-pulse" style={{ animationDuration: '7s' } as React.CSSProperties}>
        <img src="/degree_college.png" alt="" className="w-full h-48 object-cover rounded-xl" />
        <img src="https://images.unsplash.com/photo-1562774053-701939374585?w=400" alt="" className="w-full h-64 object-cover rounded-xl" />
        <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400" alt="" className="w-full h-48 object-cover rounded-xl" />
      </div>
      {/* Column 4 */}
      <div className="flex-1 flex flex-col gap-4 translate-y-12 animate-pulse" style={{ animationDuration: '9s' } as React.CSSProperties}>
        <img src="/technical_institute.png" alt="" className="w-full h-64 object-cover rounded-xl" />
        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400" alt="" className="w-full h-48 object-cover rounded-xl" />
        <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400" alt="" className="w-full h-64 object-cover rounded-xl" />
      </div>
    </div>
  );
};

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDevMode, setShowDevMode] = useState(false);

  // Registration States
  const [registerRole, setRegisterRole] = useState<'STUDENT' | 'PARENT' | null>(null);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Please fill in all details.');
      return;
    }

    setRegLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          role: registerRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register account.');
      }

      // Auto login after successful registration!
      setClientSession(registerRole!);
    } catch (err: any) {
      setRegError(err.message || 'An error occurred. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

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
    <div className="min-h-screen flex items-center justify-center p-6 relative bg-[#07090e]">
      {/* Background Parallax Grid Collage */}
      <BackgroundGallery />

      {/* Dev Mode Toggle Gear */}
      <button
        onClick={() => setShowDevMode(!showDevMode)}
        className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-emerald-400 hover:bg-zinc-900/50 rounded-lg transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider z-50 select-none"
        title="Toggle Developer Options"
      >
        <Settings className={cn("h-4 w-4", showDevMode ? "animate-spin" : "")} />
        <span>{showDevMode ? "Production Mode" : "Developer View"}</span>
      </button>

      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 h-[400px] w-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className={cn(
        "w-full items-stretch transition-all duration-300",
        showDevMode ? "max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8" : "max-w-md flex flex-col"
      )}>
        
        {/* Left Card: Form */}
        <div className="white-glass-card p-8 rounded-2xl flex flex-col justify-between relative z-10 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <School className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-zinc-900 uppercase tracking-wider block">Sri Gowthami</span>
                <span className="text-[9px] text-zinc-500 font-medium">Educational Group</span>
              </div>
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-955">Access Console</h1>
              <p className="text-zinc-600 text-xs mt-1">
                {showDevMode 
                  ? "Sign in with credentials, or use simulation quick dials on the right." 
                  : "Sign in to access your student, parent, or faculty portal."
                }
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleStandardSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-600 uppercase">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. counsellor.rama@gowthami.edu"
                  className="w-full white-glass-input rounded-lg p-2.5 text-xs placeholder-zinc-400 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-600 uppercase">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full white-glass-input rounded-lg p-2.5 text-xs placeholder-zinc-400 outline-none transition-colors"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/10"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </form>

            <div className="text-center text-[10px] text-zinc-500 border-t border-zinc-200/60 pt-3">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setRegisterRole("STUDENT")}
                className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Register as Student
              </button>
              {" "}or{" "}
              <button
                type="button"
                onClick={() => setRegisterRole("PARENT")}
                className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Register as Parent
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200 flex justify-between items-center text-[10px] text-zinc-500">
            <Link href="/" className="hover:text-zinc-800 font-semibold transition-colors">← Back to Home</Link>
            {showDevMode && <span>Sandbox Session v1.0</span>}
          </div>
        </div>

        {/* Right Card: Quick simulation selections */}
        {showDevMode && (
          <div className="white-glass-card p-8 rounded-2xl flex flex-col justify-between relative z-10 border-amber-500/15 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs border-b border-zinc-200 pb-3">
                <ShieldAlert className="h-4.5 w-4.5" />
                <span>Developer Quick Simulation logins</span>
              </div>

              <p className="text-[11px] text-zinc-650 leading-relaxed font-medium">
                Bypass OAuth flow in this offline sandbox. Click on any profile card below to assume their database roles instantly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 w-full">
                <Button
                  onClick={() => handleQuickSimulation('SUPER_ADMIN')}
                  className="p-3 text-left rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors flex flex-col gap-0.5 w-full text-zinc-800"
                >
                  <span className="text-xs font-semibold text-emerald-600">Super Admin</span>
                  <span className="text-[9px] text-zinc-500">Director View (Sri Devi)</span>
                </Button>

                <Button
                  onClick={() => handleQuickSimulation('COUNSELLOR')}
                  className="p-3 text-left rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors flex flex-col gap-0.5 w-full text-zinc-800"
                >
                  <span className="text-xs font-semibold text-blue-600">Counsellor Desk</span>
                  <span className="text-[9px] text-zinc-500">CRM & remarks (Rama Rao)</span>
                </Button>

                <Button
                  onClick={() => handleQuickSimulation('FACULTY')}
                  className="p-3 text-left rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors flex flex-col gap-0.5 w-full text-zinc-800"
                >
                  <span className="text-xs font-semibold text-amber-600">Faculty Staff</span>
                  <span className="text-[9px] text-zinc-500">Campuses & approvals</span>
                </Button>

                <Button
                  onClick={() => handleQuickSimulation('STUDENT')}
                  className="p-3 text-left rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors flex flex-col gap-0.5 w-full text-zinc-800"
                >
                  <span className="text-xs font-semibold text-purple-600">Student Profile</span>
                  <span className="text-[9px] text-zinc-500">File uploads (Aditya Varma)</span>
                </Button>

                <Button
                  onClick={() => handleQuickSimulation('PARENT')}
                  className="p-3 text-left rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors flex flex-col gap-0.5 sm:col-span-2 w-full text-zinc-800"
                >
                  <span className="text-xs font-semibold text-rose-600">Parent Portal</span>
                  <span className="text-[9px] text-zinc-500">Ward progression tracker (Srinivas Varma)</span>
                </Button>
              </div>
            </div>

            <div className="pt-4 text-center text-[9px] text-zinc-500 font-semibold">
              Offline Sandbox persist mode is ACTIVE.
            </div>
          </div>
        )}

      </div>

      {/* Registration Modal */}
      {registerRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-overlay">
          <div className="w-full max-w-sm bg-white dark:glass-panel border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl space-y-4 relative shadow-2xl animate-fade-in text-zinc-900 dark:text-white">
            <button
              onClick={() => {
                setRegisterRole(null);
                setRegName("");
                setRegEmail("");
                setRegPassword("");
                setRegError(null);
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-400 cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div>
              <h2 className="text-sm font-bold">
                Register as {registerRole === "STUDENT" ? "Student" : "Parent"}
              </h2>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Create a sandbox profile to access the admissions console.
              </p>
            </div>

            {regError && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-[11px] font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder={registerRole === "STUDENT" ? "e.g. Aditya Varma" : "e.g. Srinivas Varma"}
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 outline-none focus:border-emerald-500"
                />
              </div>

              <Button
                type="submit"
                disabled={regLoading}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                {regLoading ? "Registering..." : "Submit Registration"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
