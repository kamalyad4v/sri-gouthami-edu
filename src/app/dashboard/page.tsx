'use client';

import { useEffect, useState } from 'react';
import { getClientSession, UserSession } from '@/lib/auth-session';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  TrendingUp,
  Users,
  Award,
  Clock,
  Sparkles,
  School,
  ArrowUpRight,
  FileCheck,
  FileText,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Lazy-load heavy charting library to reduce initial bundle
const LazyCharts = dynamic(() => import('recharts').then(mod => {
  return { default: () => null };
}), { ssr: false });

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

// Mock chart data
const MONTHLY_ADMISSIONS = [
  { name: 'Jan', School: 12, JuniorCollege: 22, Degree: 15 },
  { name: 'Feb', School: 19, JuniorCollege: 28, Degree: 21 },
  { name: 'Mar', School: 32, JuniorCollege: 42, Degree: 30 },
  { name: 'Apr', School: 45, JuniorCollege: 65, Degree: 48 },
  { name: 'May', School: 60, JuniorCollege: 89, Degree: 72 },
  { name: 'Jun', School: 85, JuniorCollege: 120, Degree: 95 },
];

const CAMPUS_DISTRIBUTION = [
  { name: 'Kakinada (School)', value: 120, color: '#10B981' },
  { name: 'Rajahmundry (Jr Col)', value: 240, color: '#3B82F6' },
  { name: 'Amalapuram (Degree)', value: 180, color: '#8B5CF6' },
  { name: 'Visakhapatnam (ITI)', value: 90, color: '#F59E0B' },
];

const COURSE_POPULARITY = [
  { name: 'B.Sc CS', count: 90 },
  { name: 'MPC', count: 120 },
  { name: 'BiPC', count: 85 },
  { name: 'B.Com', count: 70 },
  { name: 'ITI Elect', count: 55 },
];

const COUNSELLOR_PERFORMANCE = [
  { name: 'Rama Rao', Assigned: 45, Admitted: 28 },
  { name: 'Sita Kumari', Assigned: 40, Admitted: 22 },
];

export default function DashboardPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeSession = getClientSession();
    setSession(activeSession);

    const loadData = async () => {
      try {
        const [leadsRes, appsRes] = await Promise.all([
          fetch('/api/leads'),
          fetch('/api/applications')
        ]);
        if (leadsRes.ok && appsRes.ok) {
          setLeads(await leadsRes.json());
          setApplications(await appsRes.json());
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || !session) {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <div className="h-8 white-glass-card rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 white-glass-card rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 white-glass-card rounded-xl" />
          <div className="h-80 white-glass-card rounded-xl" />
        </div>
      </div>
    );
  }

  // --- RENDERS BASED ON ROLE ---

  const renderAdminDashboard = () => {
    const totalLeads = leads.length;
    const admittedLeads = leads.filter(l => l.status === 'ADMITTED').length;
    const pendingApps = applications.filter(a => a.status === 'APPLICATION_SUBMITTED').length;
    
    // Project revenue (admitted * fees)
    const projectedRevenue = leads
      .filter(l => l.status === 'ADMITTED')
      .reduce((sum, l) => sum + (l.courseId === 'crs-5' ? 60000 : 45000), 0);

    return (
      <div className="space-y-6">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="white-glass-card p-5 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Total Enquiries</span>
              <h2 className="text-2xl font-bold mt-1 text-zinc-900">{totalLeads}</h2>
              <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 mt-1 font-bold">
                +12% from last week
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
          </div>

          <div className="white-glass-card p-5 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Pending Apps</span>
              <h2 className="text-2xl font-bold mt-1 text-zinc-900">{pendingApps}</h2>
              <span className="text-[10px] text-amber-600 flex items-center gap-0.5 mt-1 font-bold">
                Requires verification
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>

          <div className="white-glass-card p-5 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Admitted Students</span>
              <h2 className="text-2xl font-bold mt-1 text-zinc-900">{admittedLeads}</h2>
              <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 mt-1 font-bold">
                Target achievement 82%
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center">
              <Award className="h-5 w-5 text-emerald-600" />
            </div>
          </div>

          <div className="white-glass-card p-5 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Projected Revenue</span>
              <h2 className="text-2xl font-bold mt-1 text-zinc-900">{formatCurrency(projectedRevenue || 45000)}</h2>
              <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 mt-1 font-bold">
                From current admissions
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend Area Chart */}
          <div className="white-glass-card p-5 rounded-xl">
            <h3 className="text-sm font-bold text-zinc-900 mb-4">Admissions by Month (Campus Share)</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_ADMISSIONS}>
                  <defs>
                    <linearGradient id="colorSchool" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorJrCol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="name" stroke="#52525b" fontSize={11} />
                  <YAxis stroke="#52525b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', color: '#1a1a1a' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="School" stroke="#10B981" fillOpacity={1} fill="url(#colorSchool)" />
                  <Area type="monotone" dataKey="JuniorCollege" stroke="#3B82F6" fillOpacity={1} fill="url(#colorJrCol)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Campus Distribution Pie Chart */}
          <div className="white-glass-card p-5 rounded-xl">
            <h3 className="text-sm font-bold text-zinc-900 mb-4">Enrolment Share by Campus</h3>
            <div className="h-72 flex flex-col sm:flex-row items-center justify-around">
              <div className="h-56 w-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CAMPUS_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {CAMPUS_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', color: '#1a1a1a' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 text-xs">
                {CAMPUS_DISTRIBUTION.map(c => (
                  <div key={c.name} className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-zinc-600 font-semibold">{c.name}:</span>
                    <span className="font-bold text-zinc-900">{c.value} students</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Course Popularity Bar Chart */}
          <div className="white-glass-card p-5 rounded-xl">
            <h3 className="text-sm font-bold text-zinc-900 mb-4">Top Program Registrations</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={COURSE_POPULARITY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="name" stroke="#52525b" fontSize={11} />
                  <YAxis stroke="#52525b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', color: '#1a1a1a' }} />
                  <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Counsellor Performance */}
          <div className="white-glass-card p-5 rounded-xl">
            <h3 className="text-sm font-bold text-zinc-900 mb-4">Counsellor Conversion Chart</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={COUNSELLOR_PERFORMANCE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="name" stroke="#52525b" fontSize={11} />
                  <YAxis stroke="#52525b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', color: '#1a1a1a' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Assigned" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Admitted" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Leads Activity Feed */}
          <div className="white-glass-card p-5 rounded-xl lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-zinc-900">Recent Enquiries Feed</h3>
              <Link href="/leads" className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 font-bold">
                Manage CRM <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3.5">
              {leads.slice(0, 4).map(lead => (
                <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900">{lead.studentName}</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      Applied for {lead.courseId === 'crs-5' ? 'B.Sc CS' : 'MPC'} | Source: {lead.leadSource}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-600 bg-zinc-150 border border-zinc-200 px-2 py-0.5 rounded-full uppercase">
                    {lead.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="white-glass-card p-5 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-900">Quick Tasks Desk</h3>
            <div className="space-y-2">
              <Link href="/leads" className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors text-xs font-semibold text-zinc-800">
                <Users className="h-4.5 w-4.5 text-emerald-600" />
                <span>Register a New Enquiry</span>
              </Link>
              <Link href="/applications" className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors text-xs font-semibold text-zinc-800">
                <FileCheck className="h-4.5 w-4.5 text-blue-600" />
                <span>Verify Pending Certificates</span>
              </Link>
              <Link href="/reports" className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors text-xs font-semibold text-zinc-800">
                <FileText className="h-4.5 w-4.5 text-purple-600" />
                <span>Compile Admissions Report</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStudentDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="white-glass-card p-6 rounded-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                  Admission Season 2026
                </span>
                <span className="text-xs text-zinc-500 font-semibold">Application Status: IN REVIEW</span>
              </div>
              <h2 className="text-xl font-bold mt-2 text-zinc-900">Welcome, Aditya Varma!</h2>
              <p className="text-zinc-600 text-xs mt-1 font-medium">
                You are applying for <strong className="text-zinc-900">B.Sc Computer Science (Honours)</strong> at our Amalapuram Campus.
              </p>
            </div>
            <Link href="/applications/app-1" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors">
              <FileCheck className="h-4 w-4" />
              <span>Track Application Desk</span>
            </Link>
          </div>
        </div>

        {/* Progression Steps */}
        <div className="white-glass-card p-6 rounded-xl">
          <h3 className="text-sm font-bold text-zinc-900 mb-6">Your Admission Progress Tracker</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {[
              { title: 'Enquiry Registered', desc: 'CRM entry made', date: 'June 01, 2026', done: true },
              { title: 'Application Form', desc: 'Course selected', date: 'June 02, 2026', done: true },
              { title: 'Document Upload', desc: 'Aadhaar, memos uploaded', date: 'June 02, 2026', done: true },
              { title: 'Final Verification', desc: 'Counsellor review', date: 'Pending', done: false },
            ].map((step, idx) => (
              <div key={idx} className="relative flex flex-col p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${step.done ? 'text-emerald-600' : 'text-zinc-500'}`}>
                  {step.done ? '✓ Step Complete' : '○ Pending Review'}
                </span>
                <span className="text-xs font-bold text-zinc-900 mt-1">{step.title}</span>
                <span className="text-[10px] text-zinc-500 mt-0.5">{step.desc}</span>
                <span className="text-[9px] text-zinc-400 mt-2 font-medium">{step.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Left/Right Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document list status */}
          <div className="white-glass-card p-5 rounded-xl lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900">Your Verification Certificates Checklist</h3>
            <div className="space-y-2.5">
              {[
                { name: 'Aadhaar Card', status: 'APPROVED' },
                { name: 'SSC Memo (10th)', status: 'APPROVED' },
                { name: 'Student Photo', status: 'APPROVED' },
                { name: 'Intermediate Memo (12th)', status: 'PENDING' },
                { name: 'Transfer Certificate', status: 'PENDING' },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs">
                  <span className="font-bold text-zinc-800">{doc.name}</span>
                  <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full ${
                    doc.status === 'APPROVED' ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-600 bg-amber-500/10 border-amber-500/20'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Helper card */}
          <div className="white-glass-card p-5 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                <Sparkles className="h-4 w-4" />
                <span>AI Guidance Advisor</span>
              </div>
              <h3 className="font-bold text-sm text-zinc-900 mt-2">Unsure about Course Paths?</h3>
              <p className="text-zinc-650 text-xs mt-1.5 leading-relaxed font-medium">
                Take our AI-powered course recommender! Provide your previous subject streams, goals, and interests to receive targeted options.
              </p>
            </div>
            <Link href="/courses" className="mt-4 w-full py-2.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-center text-xs font-bold text-emerald-600 block transition-colors">
              Launch Recommender
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const renderParentDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="white-glass-card p-6 rounded-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                Parent Tracker Desk
              </span>
              <h2 className="text-xl font-bold mt-2 text-zinc-900">Srinivas Varma</h2>
              <p className="text-zinc-650 text-xs mt-1 font-medium">
                Tracking status for ward: <strong className="text-zinc-900">Aditya Varma</strong> (Selected: B.Sc Computer Science, Amalapuram Campus).
              </p>
            </div>
            <Link href="/applications/app-1" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors">
              <FileCheck className="h-4 w-4" />
              <span>Track Application Desk</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="white-glass-card p-5 rounded-xl lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900">Document Compliance List</h3>
            <div className="space-y-2.5">
              {[
                { name: 'Aadhaar Card (Aditya Varma)', status: 'APPROVED' },
                { name: 'SSC Memo (10th)', status: 'APPROVED' },
                { name: 'Student Photo', status: 'APPROVED' },
                { name: 'Intermediate Memo (12th)', status: 'PENDING' },
                { name: 'Transfer Certificate', status: 'PENDING' },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs">
                  <span className="font-bold text-zinc-800">{doc.name}</span>
                  <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full ${
                    doc.status === 'APPROVED' ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-600 bg-amber-500/10 border-amber-500/20'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="white-glass-card p-5 rounded-xl space-y-3.5">
            <h3 className="text-sm font-bold text-zinc-900">Payment Installments</h3>
            <div className="space-y-2">
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-zinc-800">First Installment</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Paid via NetBanking</p>
                </div>
                <span className="text-emerald-600 font-bold">₹15,000</span>
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-zinc-800">Pending Tuition Due</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Due on Admission Approval</p>
                </div>
                <span className="text-amber-600 font-bold">₹35,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFacultyDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="white-glass-card p-5 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Active Campuses</span>
              <h2 className="text-2xl font-bold mt-1 text-zinc-900">4</h2>
            </div>
            <div className="h-10 w-10 rounded bg-zinc-50 border border-zinc-200 flex items-center justify-center">
              <School className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="white-glass-card p-5 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Affiliated Programs</span>
              <h2 className="text-2xl font-bold mt-1 text-zinc-900">8</h2>
            </div>
            <div className="h-10 w-10 rounded bg-zinc-50 border border-zinc-200 flex items-center justify-center">
              <FolderOpen className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="white-glass-card p-5 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Verification Action Needed</span>
              <h2 className="text-2xl font-bold mt-1 text-amber-600">2</h2>
            </div>
            <div className="h-10 w-10 rounded bg-zinc-50 border border-zinc-200 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 animate-bounce" />
            </div>
          </div>
        </div>

        <div className="white-glass-card p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-zinc-900">Programs Roster Overview</h3>
          <div className="space-y-2.5">
            {[
              { campus: 'Sri Gowthami Degree College', program: 'B.Sc Computer Science (Honours)', seats: '180/240 filled', status: 'Optimal' },
              { campus: 'Sri Gowthami Junior College', program: 'Intermediate (MPC)', seats: '240/250 filled', status: 'Near Full' },
              { campus: 'Sri Gowthami School', program: 'Class 10 Board Program', seats: '120/150 filled', status: 'Optimal' },
              { campus: 'Sri Gowthami ITI', program: 'ITI Electrician', seats: '55/60 filled', status: 'Optimal' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 gap-2">
                <div>
                  <h4 className="font-bold text-xs text-zinc-900">{item.program}</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{item.campus}</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="text-zinc-600">{item.seats}</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const currentRole = session.role;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-2">
            Sri Gowthami Portal <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-500 uppercase">Beta</span>
          </h1>
          <p className="text-zinc-500 text-xs mt-1">
            Institutional Admission Management Systems. Local date: {formatDate(new Date().toISOString())}
          </p>
        </div>
        
        {/* Simple role summary banner */}
        <div className="px-3.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-600 text-xs">
          Operating Mode: <span className="text-emerald-600 font-bold uppercase">{process.env.NEXT_PUBLIC_MOCK_ENV === 'true' ? 'Mock-Persistent SQLite-like JSON' : 'PostgreSQL Live'}</span>
        </div>
      </div>

      {currentRole === 'SUPER_ADMIN' && renderAdminDashboard()}
      {currentRole === 'COUNSELLOR' && renderAdminDashboard()}
      {currentRole === 'FACULTY' && renderFacultyDashboard()}
      {currentRole === 'STUDENT' && renderStudentDashboard()}
      {currentRole === 'PARENT' && renderParentDashboard()}
    </div>
  );
}
