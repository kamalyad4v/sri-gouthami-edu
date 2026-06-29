'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button, LiquidButton, MetalButton } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { getClientSession, UserSession } from '@/lib/auth-session';
import { formatDate } from '@/lib/utils';
import { DocStatus, LeadStatus } from '@/lib/mock-db';
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  Eye,
  UploadCloud,
  Loader2,
  Lock,
  ChevronRight,
  Award,
  X
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const [session, setSession] = useState<UserSession | null>(null);
  const [app, setApp] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Verification states
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // AI Summary state
  const [aiScanning, setAiScanning] = useState(false);
  const [aiReport, setAiReport] = useState<any | null>(null);

  // Student upload simulation state
  const [uploadDocName, setUploadDocName] = useState('Aadhaar Card');
  const [uploadUrl, setUploadUrl] = useState('https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications?id=${applicationId}`);
      if (res.ok) {
        setApp(await res.json());
      } else {
        router.push('/applications');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSession(getClientSession());
    loadData();
  }, [applicationId]);

  const handleVerifyDoc = async (docId: string, status: DocStatus) => {
    if (status === 'REJECTED' && !rejectionReason.trim()) {
      alert('Please enter a rejection feedback reason.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: docId,
          status,
          rejectionReason: status === 'REJECTED' ? rejectionReason : null,
        }),
      });

      if (res.ok) {
        setSelectedDoc(null);
        setRejectionReason('');
        await loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRunAiEvaluation = async () => {
    setAiScanning(true);
    setAiReport(null);

    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId })
      });

      if (res.ok) {
        const report = await res.json();
        setAiReport(report);

        // Auto update cached values inside mockdb/db by patching
        await fetch('/api/applications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: applicationId,
            aiSummary: report.summary,
            aiRiskFlags: report.riskFlags.join(', '),
            aiRecommendation: report.recommendation,
          }),
        });

        await loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiScanning(false);
    }
  };

  const handleApplyScholarship = async () => {
    if (!app) return;
    setActionLoading(true);
    try {
      // Mock scholarship discount updates inside database by pushing note
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: app.studentId, // Note links to lead id
          note: 'AI Merit Scholarship Applied: Eligible for 25% discount waiver.',
          authorId: session?.id || 'usr-1',
        }),
      });
      alert('Merit Scholarship added to counsellor logs successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSimulateStudentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl.trim()) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: uploadDocName,
          url: uploadUrl,
          applicationId,
        }),
      });

      if (res.ok) {
        // Also update application status back to submit
        await fetch('/api/applications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: applicationId,
            status: 'APPLICATION_SUBMITTED',
          }),
        });

        setUploadUrl('https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600');
        await loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFastTrackVerify = async () => {
    setActionLoading(true);
    try {
      await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: applicationId,
          status: 'VERIFIED',
        }),
      });
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEnrolAdmit = async () => {
    setActionLoading(true);
    try {
      await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: applicationId,
          status: 'ADMITTED',
        }),
      });
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !app || !session) {
    return <div className="p-8 text-center text-zinc-500 animate-pulse">Loading Application Folder...</div>;
  }

  const isStaff = session.role === 'SUPER_ADMIN' || session.role === 'COUNSELLOR' || session.role === 'FACULTY';
  const isStudent = session.role === 'STUDENT';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-white">
      {/* Title Back navigation */}
      <div className="pb-4 border-b border-zinc-900 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/applications"
            className="p-2 rounded-lg glass-input text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-emerald-400 text-xs font-semibold">{app.applicationNo}</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                {(app.status || 'APPLICATION_SUBMITTED').replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-lg font-bold text-white mt-1">Reviewing: {app.student?.name || 'Applicant'}</h1>
          </div>
        </div>

        {isStaff && app.status === 'APPLICATION_SUBMITTED' && (
          <Button
            onClick={handleFastTrackVerify}
            disabled={actionLoading}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md shadow-indigo-500/10"
          >
            Mark Credential Verified
          </Button>
        )}

        {isStaff && app.status === 'VERIFIED' && (
          <Button
            onClick={handleEnrolAdmit}
            disabled={actionLoading}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md shadow-emerald-500/10"
          >
            Approve & Enrol Student
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Folder items files list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <FileText className="h-4.5 w-4.5 text-emerald-400" />
              <span>Mandatory Enrollment Certificates Checklist</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {app.documents.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-zinc-600 text-xs">No certificates uploaded yet.</div>
              ) : (
                app.documents.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl glass-input flex justify-between items-center text-xs relative overflow-hidden"
                  >
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-zinc-200">{doc.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-[4px] border text-[8px] font-extrabold uppercase",
                          doc.status === 'APPROVED' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                          doc.status === 'REJECTED' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
                          'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        )}>
                          {doc.status}
                        </span>
                        <span className="text-[9px] text-zinc-500">{formatDate(doc.createdAt)}</span>
                      </div>
                      {doc.rejectionReason && (
                        <p className="text-[9.5px] text-rose-400 italic">Reason: "{doc.rejectionReason}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                        title="View Certificate file"
                      >
                        <Eye className="h-4 w-4" />
                      </a>

                      {isStaff && (
                        <Button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setRejectionReason(doc.rejectionReason || '');
                          }}
                          className="px-2.5 py-2 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase transition-all"
                        >
                          Verify Drawer
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Student Upload Panel Simulation */}
          {isStudent && (
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <UploadCloud className="h-4.5 w-4.5 text-emerald-400" />
                <span>Simulate Certificate Upload Drawer (Student Mode)</span>
              </div>

              <form onSubmit={handleSimulateStudentUpload} className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase">Document Category</label>
                  <select
                    value={uploadDocName}
                    onChange={e => setUploadDocName(e.target.value)}
                    className="w-full glass-input rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Aadhaar Card" className="bg-zinc-950">Aadhaar Card</option>
                    <option value="SSC Memo (10th)" className="bg-zinc-950">SSC Memo (10th)</option>
                    <option value="Intermediate Memo (12th)" className="bg-zinc-950">Intermediate Memo (12th)</option>
                    <option value="Transfer Certificate" className="bg-zinc-950">Transfer Certificate</option>
                    <option value="Student Photo" className="bg-zinc-950">Student Photo</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase">Image/File Link (URL)</label>
                  <input
                    type="text"
                    value={uploadUrl}
                    onChange={e => setUploadUrl(e.target.value)}
                    className="w-full glass-input rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={actionLoading}
                  className="col-span-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>{actionLoading ? 'Uploading...' : 'Upload Document'}</span>
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: AI Scan Evaluation Desk */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                <span>AI Admissions Advisor Scanner</span>
              </div>

              {isStaff && (
                <Button
                  onClick={handleRunAiEvaluation}
                  disabled={aiScanning}
                  className="px-2.5 py-1.5 rounded-lg glass-input hover:bg-zinc-800 text-[10px] font-bold text-emerald-400 uppercase transition-colors flex items-center gap-1"
                >
                  {aiScanning && <Loader2 className="h-3 w-3 animate-spin" />}
                  <span>Scan Application</span>
                </Button>
              )}
            </div>

            {aiScanning && (
              <div className="py-8 text-center text-zinc-500 text-xs animate-pulse">
                Evaluating candidate logs matching SSC transcripts eligibility criteria...
              </div>
            )}

            {!aiScanning && !aiReport && !app.aiSummary && (
              <div className="py-8 text-center text-zinc-600 text-xs">
                No evaluation summary generated yet. Click Scan to run diagnostic check.
              </div>
            )}

            {(aiReport || app.aiSummary) && (
              <div className="space-y-4 text-xs">
                {/* Overall summary */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Scan Summary</span>
                  <p className="text-zinc-300 leading-relaxed font-medium glass-input p-3 rounded-lg">
                    {aiReport?.summary || app.aiSummary}
                  </p>
                </div>

                {/* Risk flags */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Risk Warnings</span>
                  {((aiReport && aiReport.riskFlags.length === 0) || (app.aiRiskFlags === '')) ? (
                    <p className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> No risks identified</p>
                  ) : (
                    <div className="space-y-1">
                      {aiReport ? (
                        aiReport.riskFlags.map((risk: string, i: number) => (
                          <div key={i} className="flex gap-1.5 items-start text-amber-400 font-semibold bg-amber-500/5 border border-amber-500/10 p-2 rounded-lg text-[11px]">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            <span>{risk}</span>
                          </div>
                        ))
                      ) : (
                        app.aiRiskFlags.split(', ').map((risk: string, i: number) => (
                          <div key={i} className="flex gap-1.5 items-start text-amber-400 font-semibold bg-amber-500/5 border border-amber-500/10 p-2 rounded-lg text-[11px]">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            <span>{risk}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Recommendation */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Automated Recommendation</span>
                  <span className={cn(
                    "inline-block font-extrabold text-[10px] uppercase border px-2.5 py-0.5 rounded-full mt-1",
                    (aiReport?.recommendation || app.aiRecommendation) === 'APPROVE' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                    (aiReport?.recommendation || app.aiRecommendation) === 'REVIEW' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                    'text-rose-400 bg-rose-500/10 border-rose-500/20'
                  )}>
                    {aiReport?.recommendation || app.aiRecommendation}
                  </span>
                </div>

                {/* Scholarship trigger */}
                {isStaff && (aiReport?.scholarshipEligible || app.aiSummary?.includes('scholarship')) && (
                  <div className="pt-3 border-t border-zinc-900 space-y-2.5">
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <Award className="h-4 w-4 shrink-0" />
                      <span>Merit Scholarship Slot Eligible!</span>
                    </div>
                    <Button
                      onClick={handleApplyScholarship}
                      disabled={actionLoading}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10.5px] uppercase rounded-lg transition-colors flex items-center justify-center gap-1 shadow-md shadow-emerald-500/10"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Apply Scholarship Waiver</span>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Document Approve / Reject Drawer */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-overlay">
          <div className="w-full max-w-sm bg-white dark:glass-panel border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl space-y-4 relative shadow-2xl">
            <Button
              onClick={() => {
                setSelectedDoc(null);
                setRejectionReason('');
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-400"
            >
              <X className="h-4.5 w-4.5" />
            </Button>

            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Verify Certificate File</h2>
              <p className="text-[10px] text-zinc-500 mt-0.5">Auditing: **{selectedDoc.name}**</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <p className="text-zinc-600 dark:text-zinc-400">
                Confirm whether the uploaded certificate complies with credentials checklist guidelines.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Rejection Feedback (Mandatory if rejected)</label>
                <input
                  type="text"
                  placeholder="e.g. Blurry scan copy, please re-upload"
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-zinc-900 dark:text-white outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleVerifyDoc(selectedDoc.id, 'REJECTED')}
                  disabled={actionLoading || (rejectionReason.trim() === '')}
                  className="flex-grow py-2 rounded-lg bg-rose-50 dark:bg-rose-600/20 hover:bg-rose-100 dark:hover:bg-rose-600/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 font-medium disabled:opacity-50 transition-colors"
                >
                  Reject File
                </Button>
                <Button
                  onClick={() => handleVerifyDoc(selectedDoc.id, 'APPROVED')}
                  disabled={actionLoading}
                  className="flex-grow py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-500/10"
                >
                  Approve File
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
