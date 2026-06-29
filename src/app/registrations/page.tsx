'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { getClientSession, UserSession } from '@/lib/auth-session';
import { formatDate } from '@/lib/utils';
import { LeadStatus } from '@/lib/mock-db';
import {
  Search,
  Filter,
  UserCheck,
  X,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Tag,
  Briefcase,
  AlertCircle,
  Building,
  GraduationCap,
  BookOpen
} from 'lucide-react';

export default function RegistrationsPage() {
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

  // Modals state
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const [activeLead, setActiveLead] = useState<any | null>(null);
  const [assignCounsellorId, setAssignCounsellorId] = useState('');
  const [activeStatus, setActiveStatus] = useState<LeadStatus>('NEW');
  const [actionLoading, setActionLoading] = useState(false);

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

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch all data
      const [leadsRes, campRes, progRes, courRes, userRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/campuses'),
        fetch('/api/programs'),
        fetch('/api/courses'),
        fetch('/api/users'),
      ]);

      if (leadsRes.ok) {
        const rawLeads = await leadsRes.json();
        // Filter strictly to show new registrations (leads with status === 'NEW')
        setLeads(rawLeads.filter((l: any) => l.status === 'NEW'));
      }
      if (campRes.ok) setCampuses(await campRes.json());
      if (progRes.ok) setPrograms(await progRes.json());
      if (courRes.ok) setCourses(await courRes.json());
      if (userRes.ok) {
        const users = await userRes.json();
        setCounsellors(users.filter((u: any) => u.role === 'COUNSELLOR' || u.role === 'SUPER_ADMIN'));
      }
    } catch (err) {
      console.error('Failed to load registrations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSession(getClientSession());
    loadData();
  }, []);

  const handleAssignCounsellor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead || !assignCounsellorId) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeLead.id,
          counsellorId: assignCounsellorId,
        }),
      });

      if (res.ok) {
        setIsAssignOpen(false);
        setAssignCounsellorId('');
        setActiveLead(null);
        await loadData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to assign counsellor');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setActiveLead(null);
        await loadData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  if (!session) return null;

  // Client filtering on registrations (Search query + Campus selector)
  const filteredRegistrations = leads.filter(reg => {
    const matchesSearch =
      reg.studentName.toLowerCase().includes(search.toLowerCase()) ||
      reg.email.toLowerCase().includes(search.toLowerCase()) ||
      reg.mobile.includes(search);
    const matchesCampus = !selectedCampus || reg.campusId === selectedCampus;
    return matchesSearch && matchesCampus;
  });

  // Analytics Helpers
  const totalRegistrations = leads.length;
  const pendingAssignment = leads.filter(reg => !reg.counsellorId).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">New Registrations Desk</h1>
          <p className="text-xs text-zinc-500 mt-1">Review, route, and assign incoming student registrations from the brochure portal.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={loadData}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors cursor-pointer"
          >
            Refresh Desk
          </Button>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Raw Candidates Intake</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-800">{totalRegistrations}</span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-full">Intake Active</span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Pending Routing</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">{pendingAssignment}</span>
            <span className="text-[10px] text-zinc-400 font-semibold">needs counsellor</span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Intake Target Ratio</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-600">
              {totalRegistrations > 0 ? Math.round(((totalRegistrations - pendingAssignment) / totalRegistrations) * 100) : 100}%
            </span>
            <span className="text-[10px] text-zinc-400 font-semibold">routed to desk</span>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white border border-zinc-200 rounded-xl shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search candidate name, email, or mobile..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2 pl-9 pr-4 text-xs placeholder-zinc-400 outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div>
          <select
            value={selectedCampus}
            onChange={e => setSelectedCampus(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2 px-3 text-xs outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            <option value="">All Target Campuses</option>
            {campuses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="text-[10px] text-zinc-400 flex items-center justify-end font-semibold">
          Filtered: {filteredRegistrations.length} registrations
        </div>
      </div>

      {/* Main Intakes Desk Table */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-zinc-500 animate-pulse font-semibold">
            Retrieving admissions registrations...
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="p-16 text-center text-xs text-zinc-500">
            No pending registrations found matching current search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Student & Parent</th>
                  <th className="p-4">Academic Preference</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Assigned Counsellor</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/65">
                {filteredRegistrations.map((reg) => {
                  const targetCampus = campuses.find(c => c.id === reg.campusId)?.name || 'Unknown';
                  const targetProgram = programs.find(p => p.id === reg.programId)?.name || 'Unknown';
                  const targetCourse = courses.find(c => c.id === reg.courseId)?.name || 'Unknown';
                  const assignedCounsellor = counsellors.find(c => c.id === reg.counsellorId);

                  return (
                    <tr key={reg.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-4 space-y-1">
                        <span className="font-bold text-zinc-800 block text-xs">{reg.studentName}</span>
                        <span className="text-[10px] text-zinc-500 block">Parent: {reg.parentName}</span>
                      </td>
                      <td className="p-4 space-y-1">
                        <span className="text-zinc-700 font-semibold block flex items-center gap-1">
                          <Building className="h-3 w-3 text-zinc-400 shrink-0" />
                          {targetCampus}
                        </span>
                        <span className="text-[10px] text-zinc-500 block flex items-center gap-1">
                          <GraduationCap className="h-3 w-3 text-zinc-400 shrink-0" />
                          {targetProgram}
                        </span>
                        <span className="text-[10px] text-zinc-400 block flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-zinc-400 shrink-0" />
                          {targetCourse}
                        </span>
                      </td>
                      <td className="p-4 space-y-1">
                        <span className="text-zinc-600 font-semibold block flex items-center gap-1">
                          <Phone className="h-3 w-3 text-zinc-400 shrink-0" />
                          {reg.mobile}
                        </span>
                        <span className="text-[10px] text-zinc-500 block flex items-center gap-1">
                          <Mail className="h-3 w-3 text-zinc-400 shrink-0" />
                          {reg.email}
                        </span>
                        {reg.address && (
                          <span className="text-[9px] text-zinc-400 block flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-zinc-400 shrink-0" />
                            {reg.address}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {assignedCounsellor ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] text-emerald-700 font-bold">
                            <Briefcase className="h-3 w-3 shrink-0" />
                            {assignedCounsellor.name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-[10px] text-amber-700 font-bold">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-zinc-500 font-medium">
                        {formatDate(reg.createdAt)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex gap-1.5">
                          <Button
                            onClick={() => {
                              setActiveLead(reg);
                              setAssignCounsellorId(reg.counsellorId || '');
                              setIsAssignOpen(true);
                            }}
                            className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 rounded text-[10px] font-semibold cursor-pointer transition-colors"
                          >
                            Route Lead
                          </Button>
                          <Button
                            onClick={() => {
                              setActiveLead(reg);
                              setActiveStatus(reg.status);
                              setIsStatusOpen(true);
                            }}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-semibold cursor-pointer transition-colors"
                          >
                            Set Status
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Route / Assign Counsellor */}
      {isAssignOpen && activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-overlay">
          <div className="w-full max-w-sm bg-white dark:glass-panel border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl space-y-4 relative shadow-2xl">
            <button
              onClick={() => {
                setIsAssignOpen(false);
                setAssignCounsellorId('');
                setActiveLead(null);
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-400 cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Route Lead Assignment</h2>
              <p className="text-[10px] text-zinc-500 mt-0.5">Assign a counsellor to manage **{activeLead.studentName}**.</p>
            </div>

            <form onSubmit={handleAssignCounsellor} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Select Staff Counsellor</label>
                <select
                  value={assignCounsellorId}
                  onChange={e => setAssignCounsellorId(e.target.value)}
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {counsellors.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.role.replace('_', ' ')})</option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                disabled={actionLoading}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {actionLoading ? 'Saving...' : 'Update Lead Assignment'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Set Status */}
      {isStatusOpen && activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-overlay">
          <div className="w-full max-w-sm bg-white dark:glass-panel border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl space-y-4 relative shadow-2xl">
            <button
              onClick={() => {
                setIsStatusOpen(false);
                setActiveLead(null);
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-400 cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Promote Intake Status</h2>
              <p className="text-[10px] text-zinc-500 mt-0.5">Select a new stage pipeline for **{activeLead.studentName}**.</p>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Pipeline Stage</label>
                <select
                  value={activeStatus}
                  onChange={e => setActiveStatus(e.target.value as LeadStatus)}
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {statusesList.map(s => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                disabled={actionLoading}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {actionLoading ? 'Updating...' : 'Confirm Pipeline Transition'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
