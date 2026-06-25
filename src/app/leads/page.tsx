'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getClientSession, UserSession } from '@/lib/auth-session';
import { formatDate } from '@/lib/utils';
import { LeadStatus } from '@/lib/mock-db';
import {
  Search,
  Filter,
  Plus,
  UserPlus,
  X,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Tag,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LeadsPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [counsellors, setCounsellors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search/Filter states
  const [search, setSearch] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const [activeLead, setActiveLead] = useState<any | null>(null);
  const [assignCounsellorId, setAssignCounsellorId] = useState('');
  const [activeStatus, setActiveStatus] = useState<LeadStatus>('NEW');
  const [actionLoading, setActionLoading] = useState(false);

  // Create lead form states
  const [formName, setFormName] = useState('');
  const [formParent, setFormParent] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCampus, setFormCampus] = useState('');
  const [formProgram, setFormProgram] = useState('');
  const [formCourse, setFormCourse] = useState('');

  const statusesList: LeadStatus[] = [
    'NEW',
    'CONTACTED',
    'INTERESTED',
    'DOCUMENTS_PENDING',
    'APPLICATION_SUBMITTED',
    'VERIFIED',
    'ADMITTED',
    'REJECTED',
  ];

  const statusColors: Record<LeadStatus, string> = {
    NEW: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    CONTACTED: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    INTERESTED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    DOCUMENTS_PENDING: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    APPLICATION_SUBMITTED: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    VERIFIED: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    ADMITTED: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    REJECTED: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const qParams = new URLSearchParams();
      if (search) qParams.set('query', search);
      if (selectedCampus) qParams.set('campusId', selectedCampus);
      if (selectedStatus) qParams.set('status', selectedStatus);

      const [leadsRes, campRes, progRes, courRes, userRes] = await Promise.all([
        fetch(`/api/leads?${qParams.toString()}`),
        fetch('/api/campuses'),
        fetch('/api/programs'),
        fetch('/api/courses'),
        fetch('/api/users'),
      ]);

      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (campRes.ok) setCampuses(await campRes.json());
      if (progRes.ok) setPrograms(await progRes.json());
      if (courRes.ok) setCourses(await courRes.json());
      if (userRes.ok) {
        const users = await userRes.json();
        setCounsellors(users.filter((u: any) => u.role === 'COUNSELLOR' || u.role === 'SUPER_ADMIN'));
      }
    } catch (err) {
      console.error('Failed to load CRM data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSession(getClientSession());
    loadData();
  }, [search, selectedCampus, selectedStatus]);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formParent || !formPhone || !formEmail || !formCampus || !formProgram || !formCourse) {
      alert('Please fill in all required fields.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: formName,
          parentName: formParent,
          mobile: formPhone,
          email: formEmail,
          address: formAddress,
          campusId: formCampus,
          programId: formProgram,
          courseId: formCourse,
          counsellorId: session?.id || null,
        }),
      });

      if (res.ok) {
        setIsCreateOpen(false);
        // Clear forms
        setFormName('');
        setFormParent('');
        setFormPhone('');
        setFormEmail('');
        setFormAddress('');
        setFormCampus('');
        setFormProgram('');
        setFormCourse('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignCounsellor = async () => {
    if (!activeLead) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeLead.id,
          counsellorId: assignCounsellorId || null,
        }),
      });

      if (res.ok) {
        setIsAssignOpen(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!activeLead) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeLead.id,
          status: activeStatus,
        }),
      });

      if (res.ok) {
        setIsStatusOpen(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Filter program selection based on selected campus in lead creation form
  const filteredPrograms = programs.filter(p => p.campusId === formCampus);
  const filteredCourses = courses.filter(c => c.programId === formProgram);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-white">
      {/* Title Header */}
      <div className="pb-4 border-b border-zinc-900 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            Admissions CRM Leads Desk <span className="text-xs text-zinc-500">Workspace</span>
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5">Filter queries, register prospective enquiries, and dispatch targets to counsellors.</p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-xs transition-colors self-start sm:self-auto shadow-lg shadow-emerald-500/10"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Enquiry</span>
        </button>
      </div>

      {/* Filter panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-900">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 focus-within:border-emerald-500/50 transition-colors">
          <Search className="h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search candidate name, parent or mobile..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-0 outline-none text-xs w-full text-zinc-200 placeholder-zinc-500"
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
          <Filter className="h-4 w-4 text-zinc-500" />
          <select
            value={selectedCampus}
            onChange={e => setSelectedCampus(e.target.value)}
            className="bg-transparent border-0 outline-none text-xs w-full text-zinc-200"
          >
            <option value="" className="bg-zinc-950">All Campuses</option>
            {campuses.map(c => (
              <option key={c.id} value={c.id} className="bg-zinc-950">{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
          <Filter className="h-4 w-4 text-zinc-500" />
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-transparent border-0 outline-none text-xs w-full text-zinc-200"
          >
            <option value="" className="bg-zinc-950">All Statuses</option>
            {statusesList.map(s => (
              <option key={s} value={s} className="bg-zinc-950">{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Database Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-zinc-500 animate-pulse">Scanning leads database files...</div>
        ) : leads.length === 0 ? (
          <div className="p-16 text-center text-zinc-500 text-xs">No matching enquiries registered.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-900/40 text-zinc-400 font-semibold uppercase tracking-wider">
                  <th className="p-4">Student Info</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Campus & Stream Preference</th>
                  <th className="p-4">Assigned Counsellor</th>
                  <th className="p-4">Lead Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-zinc-900/20 transition-colors">
                    {/* Student Info */}
                    <td className="p-4">
                      <div className="font-bold text-zinc-100">{lead.studentName}</div>
                      <div className="text-[10px] text-zinc-500">Parent: {lead.parentName}</div>
                      <div className="text-[9px] text-zinc-600">Created: {formatDate(lead.createdAt)}</div>
                    </td>

                    {/* Contact */}
                    <td className="p-4 space-y-0.5 text-[11px] text-zinc-300">
                      <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-zinc-500" /> {lead.mobile}</div>
                      <div className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-zinc-500" /> {lead.email}</div>
                    </td>

                    {/* Stream preference */}
                    <td className="p-4">
                      <div className="font-medium text-zinc-300">{campuses.find(c => c.id === lead.campusId)?.name || 'Campus'}</div>
                      <div className="text-[10px] text-zinc-500">
                        {courses.find(c => c.id === lead.courseId)?.name || 'Course'}
                      </div>
                    </td>

                    {/* Assigned */}
                    <td className="p-4 text-zinc-300">
                      {lead.counsellorId ? (
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{counsellors.find(c => c.id === lead.counsellorId)?.name || 'Assigned'}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-600 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase",
                        statusColors[lead.status as LeadStatus] || 'text-zinc-400 border-zinc-800'
                      )}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setActiveLead(lead);
                          setActiveStatus(lead.status);
                          setIsStatusOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors"
                        title="Update Status"
                      >
                        <Tag className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setActiveLead(lead);
                          setAssignCounsellorId(lead.counsellorId || '');
                          setIsAssignOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors"
                        title="Assign Counsellor"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                      </button>

                      {lead.counsellorId && (
                        <Link
                          href={`/counsellors?leadId=${lead.id}`}
                          className="inline-flex p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors"
                          title="Open Worksheet"
                        >
                          <Briefcase className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create lead */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel p-6 rounded-2xl space-y-4 relative">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-400"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
                <span>Register New Admission Enquiry</span>
              </h2>
              <p className="text-[10px] text-zinc-500 mt-0.5">Submit the prospect fields below to register and route student details.</p>
            </div>

            <form onSubmit={handleCreateLead} className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditya Varma"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Parent Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Srinivas Varma"
                  value={formParent}
                  onChange={e => setFormParent(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Mobile Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 98480 22338"
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. aditya@gmail.com"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Residential Address</label>
                <input
                  type="text"
                  placeholder="Street details, City"
                  value={formAddress}
                  onChange={e => setFormAddress(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1 col-span-2 border-t border-zinc-900 pt-2">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Target Campus Selection *</label>
                <select
                  value={formCampus}
                  onChange={e => {
                    setFormCampus(e.target.value);
                    setFormProgram('');
                    setFormCourse('');
                  }}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                >
                  <option value="" className="bg-zinc-950">Select Campus</option>
                  {campuses.map(c => (
                    <option key={c.id} value={c.id} className="bg-zinc-950">{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Degree Program *</label>
                <select
                  value={formProgram}
                  onChange={e => {
                    setFormProgram(e.target.value);
                    setFormCourse('');
                  }}
                  required
                  disabled={!formCampus}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500 disabled:opacity-50"
                >
                  <option value="" className="bg-zinc-950">Select Program</option>
                  {filteredPrograms.map(p => (
                    <option key={p.id} value={p.id} className="bg-zinc-950">{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Course Roster *</label>
                <select
                  value={formCourse}
                  onChange={e => setFormCourse(e.target.value)}
                  required
                  disabled={!formProgram}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500 disabled:opacity-50"
                >
                  <option value="" className="bg-zinc-950">Select Course</option>
                  {filteredCourses.map(c => (
                    <option key={c.id} value={c.id} className="bg-zinc-950">{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="col-span-2 mt-2 w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-white transition-colors"
              >
                {actionLoading ? 'Creating Prospect...' : 'Register Enquiry'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign counsellor */}
      {isAssignOpen && activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm glass-panel p-6 rounded-2xl space-y-4 relative animate-fade-in">
            <button onClick={() => setIsAssignOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-400">
              <X className="h-4.5 w-4.5" />
            </button>

            <div>
              <h2 className="text-sm font-bold text-white">Assign CRM Counsellor</h2>
              <p className="text-[10px] text-zinc-500 mt-0.5">Route **{activeLead.studentName}** to an active coordinator.</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Select Staff Member</label>
                <select
                  value={assignCounsellorId}
                  onChange={e => setAssignCounsellorId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                >
                  <option value="" className="bg-zinc-950">Unassigned (None)</option>
                  {counsellors.map(c => (
                    <option key={c.id} value={c.id} className="bg-zinc-950">{c.name} ({c.role.replace('_', ' ')})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsAssignOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 text-center font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignCounsellor}
                  disabled={actionLoading}
                  className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-500/10"
                >
                  {actionLoading ? 'Saving...' : 'Assign Staff'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Update status */}
      {isStatusOpen && activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm glass-panel p-6 rounded-2xl space-y-4 relative">
            <button onClick={() => setIsStatusOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-400">
              <X className="h-4.5 w-4.5" />
            </button>

            <div>
              <h2 className="text-sm font-bold text-white">Update Lead Status</h2>
              <p className="text-[10px] text-zinc-500 mt-0.5">Select status for **{activeLead.studentName}**.</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-1.5">
                {statusesList.map(s => (
                  <button
                    key={s}
                    onClick={() => setActiveStatus(s)}
                    className={cn(
                      "p-2 rounded-lg text-left border text-[10px] uppercase font-bold transition-all",
                      activeStatus === s
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 animate-pulse"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                    )}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsStatusOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 text-center font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={actionLoading}
                  className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-500/10"
                >
                  {actionLoading ? 'Saving...' : 'Save Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
