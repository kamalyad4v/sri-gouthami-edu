'use client';

import { useState } from 'react';
import { Button, LiquidButton, MetalButton } from "@/components/ui/button";
import Link from 'next/link';
import { 
  School, 
  GraduationCap, 
  Award, 
  Compass, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Users, 
  MessageSquare,
  Menu,
  X,
  TrendingUp
} from 'lucide-react';
import { BentoGrid, type BentoItem } from '@/components/ui/bento-grid';
import { SpotlightNavbar } from '@/components/ui/spotlight-navbar';
import { MeshGradient } from "@paper-design/shaders-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const campuses = [
    { name: 'Primary & Secondary Schools', location: 'Kakinada', icon: School, desc: 'Play school to Class 10 CBSE/State Board syllabus, focused on foundational learning.' },
    { name: 'Junior Colleges (10+2)', location: 'Rajahmundry', icon: GraduationCap, desc: 'Specialized intermediate program streams in MPC and BiPC, equipped with competitive exam prep coaching.' },
    { name: 'Degree & PG Colleges', location: 'Amalapuram', icon: Award, desc: 'Undergraduate science & commerce degree courses including modern B.Sc CS and B.Com Computers.' },
    { name: 'ITI & Technical Programs', location: 'Visakhapatnam', icon: Compass, desc: 'Practical trade certifications in Electrician & Fitter engineering to prepare for immediate employment.' },
  ];

  const features = [
    { title: 'Unified CRM Leads Desk', icon: Users, desc: 'Seamlessly capture, track, and route candidate admissions enquiries across all regional branches.' },
    { title: 'AI Advisory Desk', icon: MessageSquare, desc: 'Interactive chat agent designed to guide students on eligibility criteria, fee configurations, and streams.' },
    { title: 'Document Verification', icon: ShieldCheck, desc: 'Digital check drawers to verify intermediate memos, secondary school certificates, and identity files.' },
    { title: 'Interactive Analytics', icon: Award, desc: 'Visual dashboards for group directors to monitor campus seat availability and registration conversion rates.' },
  ];

  const valueProps = [
    { title: '30+ Years Legacy', desc: 'A trusted household name in Andhra Pradesh offering stable academic environments since 1996.' },
    { title: 'Specialized Coaching', desc: 'Rigorous competitive exam integration for IIT-JEE, NEET, and local engineering entrance EAPCET.' },
    { title: 'Industry-Aligned ITI', desc: 'Direct placement assistance and practical apprenticeship models with heavy engineering firms.' },
    { title: 'Luminous Modern Facilities', desc: 'State-of-the-art computer centers, smart classroom structures, and extensive libraries.' }
  ];

  const bentoFeatures: BentoItem[] = [
    {
      title: "Unified CRM Leads Desk",
      description: "Seamlessly capture, track, and route candidate admissions enquiries across all regional branches.",
      icon: <Users className="w-4 h-4 text-emerald-400" />,
      status: "Enterprise Sync",
      tags: ["Admissions", "Routing"],
      colSpan: 2,
      hasPersistentHover: true,
    },
    {
      title: "AI Advisory Desk",
      description: "Interactive chat agent designed to guide students on eligibility, fee options, and program streams.",
      icon: <MessageSquare className="w-4 h-4 text-emerald-400" />,
      status: "AI Live",
      tags: ["Copilot", "Support"],
    },
    {
      title: "Document Verification",
      description: "Digital verification desks to inspect certificates, mark sheets, and candidate identification records.",
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      status: "Secure Vault",
      tags: ["Compliance", "Audit"],
    },
    {
      title: "Interactive Analytics",
      description: "Comprehensive reporting dashboard for administrators to monitor regional campus enrollment shares.",
      icon: <Award className="w-4 h-4 text-emerald-400" />,
      status: "v2.5",
      tags: ["Metrics", "Director-View"],
      colSpan: 2,
    },
  ];

  return (
    <div className="min-h-screen text-white flex flex-col justify-between overflow-x-hidden relative">


      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-45">
        <MeshGradient
          className="w-full h-full"
          colors={["#030712", "#022c22", "#0f3a2c", "#000000"]}
          speed={0.4}
          backgroundColor="#000000"
        />
      </div>

      {/* Header navbar */}
      <header className="max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between glass-header sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <School className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white uppercase tracking-wider block leading-none">Sri Gowthami</span>
            <span className="text-[10px] text-zinc-500 font-medium">Educational Group</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <SpotlightNavbar
          items={[
            { label: "Our Colleges", href: "#colleges" },
            { label: "Console Features", href: "#features" },
            { label: "About Us", href: "#about" },
            { label: "Why Choose Us", href: "#why-choose-us" },
          ]}
          className="hidden md:flex pt-0"
        />

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/sign-in"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
          >
            <span>Admin Portal</span>
            <ChevronRight className="h-4.5 w-4.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg glass-button text-zinc-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-0 w-full glass-dropdown p-6 flex flex-col gap-4 z-40 animate-fade-in border-b border-zinc-900/40">
          <a href="#colleges" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium hover:text-emerald-400">Our Colleges</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium hover:text-emerald-400">Console Features</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium hover:text-emerald-400">About Us</a>
          <a href="#why-choose-us" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium hover:text-emerald-400">Why Choose Us</a>
          <Link
            href="/auth/sign-in"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs"
          >
            <span>Admin Portal Login</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Main content container */}
      <main className="max-w-7xl mx-auto w-full px-6 flex-1 py-16 md:py-24 space-y-32">
        
        {/* Section 1: Hero Section */}
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
              className="px-6 py-3 rounded-lg glass-button text-zinc-300 font-semibold text-xs transition-all"
            >
              Simulate Role logins
            </Link>
          </div>
        </section>

        {/* Section 2: Colleges Info Section */}
        <section id="colleges" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Our Colleges & Campuses</h2>
            <p className="text-xs text-zinc-400">Managing student progressions from elementary school through professional skill certifications.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campuses.map((camp, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-xl space-y-4 hover:border-emerald-500/30 transition-all duration-300">
                <div className="h-9 w-9 rounded-lg glass-inner-card flex items-center justify-center">
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

        {/* Section 3: Features Section */}
        <section id="features" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Portal Features</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Comprehensive Management Tools</h2>
            <p className="text-xs text-zinc-400">Empowering administrators, counselors, and faculties to seamlessly process candidates.</p>
          </div>

          <BentoGrid items={bentoFeatures} />
        </section>

        {/* Section 4: About Us Section */}
        <section id="about" className="scroll-mt-24">
          <div className="glass-panel p-8 md:p-12 rounded-2xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Who We Are</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
                Building Academic Foundations <br />
                For Over Three Decades
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sri Gowthami Educational Group has been a cornerstone of academic excellence in Coastal Andhra Pradesh. 
                We operate across multiple specialized campuses with the vision of offering high-quality, continuous learning 
                from early primary classes to postgraduate collegiate courses.
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Our integration of competitive training models with core board syllabi guides candidates through crucial transitions, 
                equipping them with the analytical strength to unlock admissions in national-level technical universities and local corporations.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-inner-card p-5 rounded-xl text-center space-y-1">
                <span className="block text-2xl font-extrabold text-emerald-400">15k+</span>
                <span className="text-[10px] text-zinc-400 font-semibold uppercase">Alumni Success</span>
              </div>
              <div className="glass-inner-card p-5 rounded-xl text-center space-y-1">
                <span className="block text-2xl font-extrabold text-teal-400">4</span>
                <span className="text-[10px] text-zinc-400 font-semibold uppercase">Regional Branches</span>
              </div>
              <div className="glass-inner-card p-5 rounded-xl text-center space-y-1">
                <span className="block text-2xl font-extrabold text-blue-400">98%</span>
                <span className="text-[10px] text-zinc-400 font-semibold uppercase">Exam Pass Rate</span>
              </div>
              <div className="glass-inner-card p-5 rounded-xl text-center space-y-1">
                <span className="block text-2xl font-extrabold text-purple-400">30+</span>
                <span className="text-[10px] text-zinc-400 font-semibold uppercase">Years Excellence</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Why Choose Us Section */}
        <section id="why-choose-us" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Why Sri Gowthami</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">The Sri Gowthami Advantage</h2>
            <p className="text-xs text-zinc-400">How we stand out to create successful student journeys year after year.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((prop, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-xl space-y-3 flex flex-col justify-between hover:border-emerald-500/25 transition-all duration-300">
                <div className="space-y-2">
                  <div className="h-7 w-7 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <h4 className="font-bold text-xs text-white uppercase tracking-wider">{prop.title}</h4>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mt-2">{prop.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="glass-footer py-12 text-xs text-zinc-400 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-zinc-900/40 pb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-emerald-600 flex items-center justify-center">
                <School className="h-4 w-4 text-white" />
              </div>
              <span className="font-extrabold text-xs text-white uppercase tracking-wider">Sri Gowthami</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              Providing holistic educational paths from play schools to professional certifications and career placements.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider">Campuses</h4>
            <ul className="space-y-1.5 text-[11px] text-zinc-500">
              <li>Kakinada Main Campus (Schools)</li>
              <li>Rajahmundry Intermediate Unit</li>
              <li>Amalapuram Collegiate Degree</li>
              <li>Visakhapatnam ITI Center</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider">Links</h4>
            <ul className="space-y-1.5 text-[11px] text-zinc-500">
              <li><a href="#colleges" className="hover:text-emerald-400">Our Colleges</a></li>
              <li><a href="#features" className="hover:text-emerald-400">Console Features</a></li>
              <li><a href="#about" className="hover:text-emerald-400">About Us</a></li>
              <li><a href="/auth/sign-in" className="hover:text-emerald-400 font-semibold text-emerald-400">Admin Portal</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider">Contact Info</h4>
            <p className="text-[11px] text-zinc-500">
              Email: admissions@sgowthami.edu.in <br />
              Helpline: +91 98480 22338 <br />
              Corporate: Rajahmundry Road, AP, India
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 text-center space-y-2">
          <p>© 2026 Sri Gowthami Group of Institutions. All rights reserved.</p>
          <p className="text-[10px] text-zinc-500">Designed with Apple Dashboard & Linear SaaS philosophies.</p>
        </div>
      </footer>
    </div>
  );
}

