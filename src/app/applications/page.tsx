'use client';

import { useEffect, useState } from 'react';
import { getClientSession, UserSession } from '@/lib/auth-session';
import { formatDate } from '@/lib/utils';
import { LeadStatus } from '@/lib/mock-db';
import {
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  AlertTriangle,
  FolderMinus,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ApplicationsPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    setSession(getClientSession());

    const loadMeta = async () => {
      try {
        const campRes = await fetch('/api/campuses');
        if (campRes.ok) {
          setCampuses(await campRes.json());
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadMeta();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const qParams = new URLSearchParams();
      if (selectedCampus) qParams.set('campusId', selectedCampus);
      if (selectedStatus) qParams.set('status', selectedStatus);

      const res = await fetch(`/api/applications?${qParams.toString()}`);
      if (res.ok) {
        const list = await res.json();
        
        // Custom search filtering on client-side
        let filtered = list;
        if (search.trim()) {
          const q = search.toLowerCase();
          filtered = list.filter((a: any) =>
            a.student?.name.toLowerCase().includes(q) ||
            a.applicationNo.toLowerCase().includes(q)
          );
        }

        // Student and Parent access control: only show their own application!
        const activeSession = getClientSession();
        if (activeSession.role === 'STUDENT') {
          filtered = filtered.filter((a: any) => a.studentId === activeSession.id);
        } else if (activeSession.role === 'PARENT') {
          filtered = filtered.filter((a: any) => a.parentId === activeSession.id);
        }

        setApplications(filtered);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [search, selectedCampus, selectedStatus]);

  const statusLabels: Record<LeadStatus, { label: string; color: string }> = {
    NEW: { label: 'New Application', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    CONTACTED: { label: 'Contacted', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    INTERESTED: { label: 'Interested', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    DOCUMENTS_PENDING: { label: 'Doc Verification Pending', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    APPLICATION_SUBMITTED: { label: 'Submitted for Review', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    VERIFIED: { label: 'Credential Verified', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    ADMITTED: { label: 'Enrolled Admitted', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
    REJECTED: { label: 'Application Rejected', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  };

  const statuses: LeadStatus[] = [
    'NEW',
    'DOCUMENTS_PENDING',
    'APPLICATION_SUBMITTED',
    'VERIFIED',
    'ADMITTED',
    'REJECTED',
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-white">
      {/* Title */}
      <div className="pb-4 border-b border-zinc-900 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Candidates Application Desk <span className="text-xs text-zinc-500">Module 3</span>
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5">Track document uploads, verify credentials, and review risk levels.</p>
        </div>
      </div>

      {/* Filter panel */}
      {session?.role !== 'STUDENT' && session?.role !== 'PARENT' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-900">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 focus-within:border-emerald-500/50 transition-colors">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search student name or app no..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-0 outline-none text-xs w-full text-zinc-200 placeholder-zinc-500"
            />
          </div>

          {/* Campus Filter */}
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

          {/* Status Filter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
            <Filter className="h-4 w-4 text-zinc-500" />
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-transparent border-0 outline-none text-xs w-full text-zinc-200"
            >
              <option value="" className="bg-zinc-950">All Statuses</option>
              {statuses.map(s => (
                <option key={s} value={s} className="bg-zinc-950">{statusLabels[s]?.label || s}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main applications listing */}
      <div className="glass-panel rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-zinc-500 animate-pulse">Scanning Application Database...</div>
        ) : applications.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <FolderMinus className="h-10 w-10 text-zinc-600 mx-auto" />
            <div>
              <h3 className="font-semibold text-zinc-200">No Applications Logged</h3>
              <p className="text-zinc-500 text-xs">There are no matching submitted application folders here.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-900/40 text-zinc-400 font-semibold uppercase tracking-wider">
                  <th className="p-4">Application ID</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Campus & Degree Program</th>
                  <th className="p-4">Documents</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4 text-right">View Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {applications.map(app => {
                  const verifiedDocs = app.documents?.filter((d: any) => d.status === 'APPROVED').length || 0;
                  const totalDocs = app.documents?.length || 0;

                  return (
                    <tr key={app.id} className="hover:bg-zinc-900/20 transition-colors">
                      {/* ID */}
                      <td className="p-4 font-mono font-semibold text-emerald-400">
                        {app.applicationNo}
                      </td>

                      {/* Student */}
                      <td className="p-4">
                        <div className="font-bold text-zinc-200">{app.student?.name || 'Aditya Varma'}</div>
                        <div className="text-[10px] text-zinc-500">Submitted: {formatDate(app.createdAt)}</div>
                      </td>

                      {/* Program */}
                      <td className="p-4 space-y-0.5">
                        <div className="font-medium text-zinc-300">{app.campus?.name}</div>
                        <div className="text-[10px] text-zinc-500">Course: {app.course?.name}</div>
                      </td>

                      {/* Documents */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${totalDocs > 0 ? (verifiedDocs / totalDocs) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-zinc-400 font-medium">
                            {verifiedDocs}/{totalDocs} Verified
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase",
                          statusLabels[app.status as LeadStatus]?.color || 'text-zinc-400 border-zinc-800'
                        )}>
                          {statusLabels[app.status as LeadStatus]?.label || app.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="p-4 text-right">
                        <Link
                          href={`/applications/${app.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Review</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
