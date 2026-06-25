'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getClientSession, UserSession } from '@/lib/auth-session';
import { formatDate } from '@/lib/utils';
import {
  Phone,
  MessageSquare,
  History,
  Send,
  User,
  BookOpen,
  MapPin,
  CheckCircle,
  Tag,
  AlertCircle,
  ChevronRight,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper component that consumes search params (must be wrapped in Suspense in Next.js 15)
function CounsellorWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetLeadId = searchParams.get('leadId');

  const [session, setSession] = useState<UserSession | null>(null);
  const [assignedLeads, setAssignedLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  
  // Interactions
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    const activeSession = getClientSession();
    setSession(activeSession);
    setLoading(true);

    try {
      const res = await fetch(`/api/leads?counsellorId=${activeSession.id}`);
      if (res.ok) {
        const list = await res.json();
        setAssignedLeads(list);

        // Auto select target lead from search params or select the first one
        if (targetLeadId) {
          const target = list.find((l: any) => l.id === targetLeadId);
          if (target) {
            await selectLeadDetails(target.id);
          } else if (list.length > 0) {
            await selectLeadDetails(list[0].id);
          }
        } else if (list.length > 0) {
          await selectLeadDetails(list[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectLeadDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/leads?id=${id}`);
      if (res.ok) {
        setSelectedLead(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [targetLeadId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedLead || !session) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLead.id,
          note: newNote,
          authorId: session.id,
        }),
      });

      if (res.ok) {
        setNewNote('');
        // Refresh details
        await selectLeadDetails(selectedLead.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-white h-[calc(100vh-4rem)] flex flex-col">
      {/* Title */}
      <div className="pb-4 border-b border-zinc-900 shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Counsellor workspace <span className="text-xs text-zinc-500">Interaction Log</span>
        </h1>
        <p className="text-zinc-400 text-xs mt-0.5">Follow up on assigned student candidates, submit remarks notes, and record calls history.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-zinc-500 animate-pulse flex-1">Loading Workspace...</div>
      ) : assignedLeads.length === 0 ? (
        <div className="p-16 text-center text-zinc-500 text-xs flex-1 flex flex-col justify-center items-center gap-2">
          <AlertCircle className="h-8 w-8 text-zinc-700 animate-bounce" />
          <span>You currently have no assigned candidates to follow up with. Check with admin.</span>
        </div>
      ) : (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Leads queue */}
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-full border border-zinc-900 bg-zinc-950/20">
            <div className="p-3 border-b border-zinc-900 bg-zinc-900/20 shrink-0">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Assigned Leads ({assignedLeads.length})</span>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-900/60">
              {assignedLeads.map(l => {
                const isSelected = selectedLead?.id === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => selectLeadDetails(l.id)}
                    className={cn(
                      "w-full text-left p-3.5 flex items-center justify-between transition-colors",
                      isSelected ? "bg-emerald-500/5 hover:bg-emerald-500/10 border-l-2 border-emerald-500" : "hover:bg-zinc-900/35"
                    )}
                  >
                    <div className="space-y-1 overflow-hidden pr-2">
                      <div className="font-bold text-xs text-zinc-200 block truncate">{l.studentName}</div>
                      <div className="text-[9px] text-zinc-500 truncate block">Mobile: {l.mobile}</div>
                    </div>
                    <ChevronRight className={cn("h-4 w-4 text-zinc-600 transition-transform", isSelected ? "text-emerald-400 translate-x-1" : "")} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Work Sheet */}
          <div className="lg:col-span-2 h-full flex flex-col min-h-0">
            {selectedLead ? (
              <div className="glass-panel rounded-xl border border-zinc-900 p-6 flex flex-col h-full min-h-0 bg-zinc-950/20 overflow-y-auto space-y-6">
                
                {/* Lead Profile Summary Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start border-b border-zinc-900 pb-4 gap-4">
                  <div className="space-y-1.5">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-emerald-400" />
                      <span>{selectedLead.studentName}</span>
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-zinc-500" /> {selectedLead.mobile}</span>
                      <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-zinc-500" /> {selectedLead.email}</span>
                      {selectedLead.address && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-zinc-500" /> {selectedLead.address}</span>}
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-wider animate-pulse">
                    {selectedLead.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Course targets preferences */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/35 border border-zinc-800 p-4 rounded-xl text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Affiliated Campus preference</span>
                    <span className="font-semibold text-zinc-200">{selectedLead.campus?.name}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Target Course stream</span>
                    <span className="font-semibold text-zinc-200">{selectedLead.course?.name}</span>
                  </div>
                </div>

                {/* Intervention logs split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
                  {/* Notes & Actions logger */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-1 text-xs font-semibold text-white">
                        <MessageSquare className="h-4.5 w-4.5 text-emerald-400" />
                        <span>Counsellor Interaction Logs</span>
                      </div>

                      <div className="max-h-48 overflow-y-auto space-y-3.5 pr-1">
                        {(!selectedLead.notes || selectedLead.notes.length === 0) ? (
                          <p className="text-[11px] text-zinc-600 italic">No notes logged for this prospect enquiry.</p>
                        ) : (
                          selectedLead.notes.map((n: any) => (
                            <div key={n.id} className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-xs relative">
                              <p className="text-zinc-300 leading-relaxed">{n.note}</p>
                              <div className="mt-2 text-[10px] text-zinc-500 flex justify-between">
                                <span>By: {n.author?.name || 'Counsellor'}</span>
                                <span>{formatDate(n.createdAt)}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <form onSubmit={handleAddNote} className="space-y-3 border-t border-zinc-900 pt-4 mt-auto">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase block">Log call remarks note</label>
                        <textarea
                          placeholder="e.g. Spoke to applicant, requested details about scholarship timelines..."
                          value={newNote}
                          onChange={e => setNewNote(e.target.value)}
                          className="w-full h-20 bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-emerald-500/50 resize-none transition-colors"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={actionLoading || !newNote.trim()}
                        className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white transition-colors flex items-center justify-center gap-1 shadow-md shadow-emerald-500/10"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>{actionLoading ? 'Saving...' : 'Add Note'}</span>
                      </button>
                    </form>
                  </div>

                  {/* Audit Timeline */}
                  <div className="border-l border-zinc-900 pl-4 space-y-4 flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                      <History className="h-4.5 w-4.5 text-emerald-400" />
                      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Audit Timeline Log</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 my-2 pr-1 text-[11px]">
                      {(!selectedLead.activityLogs || selectedLead.activityLogs.length === 0) ? (
                        <p className="text-zinc-600 italic text-center py-8">Timeline feed is empty.</p>
                      ) : (
                        selectedLead.activityLogs.map((log: any) => (
                          <div key={log.id} className="flex gap-2.5 items-start">
                            <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                            <div className="space-y-0.5">
                              <p className="text-zinc-300 font-medium">{log.action}</p>
                              <p className="text-[9px] text-zinc-500 font-medium">
                                {formatDate(log.createdAt)} • By {log.user?.name || 'System'}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-16 text-center text-zinc-600 flex-1 flex items-center justify-center">Select a candidate folder from the left queue to open worksheet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CounsellorsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500 animate-pulse">Loading Workspace...</div>}>
      <CounsellorWorkspaceContent />
    </Suspense>
  );
}
