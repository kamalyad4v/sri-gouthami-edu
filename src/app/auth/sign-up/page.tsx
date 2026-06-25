'use client';

import { School, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-white relative">
      <div className="absolute top-0 left-1/4 h-[300px] w-[300px] bg-emerald-500/5 rounded-full blur-[70px] pointer-events-none" />

      <div className="max-w-md w-full glass-panel p-8 rounded-2xl space-y-6 relative z-10 text-center">
        <div className="mx-auto h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center mb-2">
          <School className="h-5 w-5 text-white" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-bold">Create Sandbox Account</h1>
          <p className="text-xs text-zinc-400">
            For local testing, we recommend utilizing the simulation logins on the sign-in page.
          </p>
        </div>

        <Link
          href="/auth/sign-in"
          className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white block transition-colors"
        >
          Go to Simulation Sign-In Desk
        </Link>

        <div className="pt-2 border-t border-zinc-900">
          <Link href="/" className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-400">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
