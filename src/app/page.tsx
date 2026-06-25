'use client';

import Link from 'next/link';
import { School, GraduationCap, Award, Compass, Sparkles, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const campuses = [
    { name: 'Primary & Secondary Schools', location: 'Kakinada', icon: School, desc: 'Play school to Class 10 CBSE/State Board syllabus, focused on foundational learning.' },
    { name: 'Junior Colleges (10+2)', location: 'Rajahmundry', icon: GraduationCap, desc: 'Specialized intermediate program streams in MPC and BiPC, equipped with competitive exam prep coaching.' },
    { name: 'Degree & PG Colleges', location: 'Amalapuram', icon: Award, desc: 'Undergraduate science & commerce degree courses including modern B.Sc CS and B.Com Computers.' },
    { name: 'ITI & Technical Programs', location: 'Visakhapatnam', icon: Compass, desc: 'Practical trade certifications in Electrician & Fitter engineering to prepare for immediate employment.' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between overflow-x-hidden relative">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header navbar */}
      <header className="max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between border-b border-zinc-900/60 sticky top-0 bg-zinc-950/40 backdrop-blur-md z-40">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <School className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white uppercase tracking-wider block leading-none">Sri Gowthami</span>
            <span className="text-[10px] text-zinc-500 font-medium">Educational Group</span>
          </div>
        </div>

        <Link
          href="/auth/sign-in"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
        >
          <span>Admin Portal</span>
          <ChevronRight className="h-4.5 w-4.5" />
        </Link>
      </header>

      {/* Main hero */}
      <main className="max-w-7xl mx-auto w-full px-6 flex-1 py-16 md:py-24 space-y-24">
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Sri Gowthami Admission Desk 2026-27</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Unified Multi-Campus <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">Admissions Console</span>
          </h1>

          <p className="text-zinc-400 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            Manage prospective candidate enquiries, track physical document verification drawer checklists, check analytics charts, and leverage expert offline AI admissions advice.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/auth/sign-in"
              className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20"
            >
              <span>Launch Admission Console</span>
              <ChevronRight className="h-4.5 w-4.5" />
            </Link>
            <Link
              href="/auth/sign-in"
              className="px-6 py-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs transition-all"
            >
              Simulate Role logins
            </Link>
          </div>
        </section>

        {/* Campuses grid */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-white">Sri Gowthami Educational Group</h2>
            <p className="text-xs text-zinc-500">Managing student progressions from elementary school through professional skill certifications.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campuses.map((camp, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-xl space-y-4 hover:border-emerald-500/30 transition-all duration-300">
                <div className="h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <camp.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{camp.name}</h4>
                  <span className="text-[10px] text-zinc-500 uppercase font-medium">{camp.location} Campus</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{camp.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 text-center text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto px-6">
          <p>© 2026 Sri Gowthami Group of Institutions. All rights reserved.</p>
          <p className="text-[10px] text-zinc-700 mt-1">Designed with Apple Dashboard & Linear SaaS philosophies.</p>
        </div>
      </footer>
    </div>
  );
}
