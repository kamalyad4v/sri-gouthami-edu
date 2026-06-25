'use client';

import { useEffect, useState } from 'react';
import { getClientSession, UserSession } from '@/lib/auth-session';
import { formatDate } from '@/lib/utils';
import {
  TrendingUp,
  FileText,
  Download,
  Plus,
  Table,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function ReportsPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('Admission');
  const [reportFormat, setReportFormat] = useState('CSV');

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        setReports(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSession(getClientSession());
    loadReports();
  }, []);

  const handleCompileReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !session) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: reportTitle,
          type: reportType,
          format: reportFormat,
          generatedBy: session.name,
        }),
      });

      if (res.ok) {
        setReportTitle('');
        loadReports();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Logic to simulate downloading generated data files as CSVs
  const handleDownloadCsv = (report: any) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (report.type === 'Admission') {
      csvContent += "Admission ID,Student Name,Campus Name,Course Stream,Fees Paid,Total Fees,Admitted Date\n";
      csvContent += "ADM-2026-005,Aditya Varma,Sri Gowthami Degree College,B.Sc CS (Honours),15000,60000,2026-06-01\n";
      csvContent += "ADM-2026-009,Kavitha Reddy,Sri Gowthami Degree College,B.Com Computers,50000,50000,2026-05-25\n";
    } else if (report.type === 'Campus') {
      csvContent += "Campus ID,Campus Name,Address,Affiliated Type,Active Student Count,Total Revenue\n";
      csvContent += "cam-1,Sri Gowthami School,Kakinada,School,120,4200000\n";
      csvContent += "cam-2,Sri Gowthami Junior College,Rajahmundry,Junior College,240,10800000\n";
      csvContent += "cam-3,Sri Gowthami Degree College,Amalapuram,Degree College,180,9900000\n";
      csvContent += "cam-4,Sri Gowthami ITI,Visakhapatnam,ITI,90,1710000\n";
    } else if (report.type === 'Course') {
      csvContent += "Course ID,Course Name,Duration,Fees,Eligibility,Students Enrolled\n";
      csvContent += "crs-1,Class 5 Standard,5 Years,25000,Class 4 Pass,45\n";
      csvContent += "crs-2,Class 10 Board,5 Years,35000,Class 9 Pass,120\n";
      csvContent += "crs-3,MPC 1st Year,2 Years,45000,Class 10 Pass,120\n";
      csvContent += "crs-5,B.Sc CS (Honours),3 Years,60000,Intermediate MPC,90\n";
    } else {
      // Counsellor
      csvContent += "Staff ID,Counsellor Name,Assigned Leads Count,Admitted Count,Conversion Rate (%)\n";
      csvContent += "usr-2,Rama Rao,45,28,62.2\n";
      csvContent += "usr-3,Sita Kumari,40,22,55.0\n";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${report.title.toLowerCase().replace(/\s+/g, '_')}_audit_register.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-white">
      {/* Title */}
      <div className="pb-4 border-b border-zinc-900 shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Admissions Reports Compiler <span className="text-xs text-zinc-500">Analytics</span>
        </h1>
        <p className="text-zinc-400 text-xs mt-0.5">Generate analytical audit logs and download compiled student databases files directly as CSV sheets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Compiler Form */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Plus className="h-4.5 w-4.5 text-emerald-400" />
            <span>Spawn custom audit log registers</span>
          </div>

          <form onSubmit={handleCompileReport} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Report Log Title</label>
              <input
                type="text"
                placeholder="e.g. Campus admissions analysis Q2"
                value={reportTitle}
                onChange={e => setReportTitle(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 outline-none text-white focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Registration Category</label>
              <select
                value={reportType}
                onChange={e => setReportType(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 outline-none text-white font-medium"
              >
                <option value="Admission">Overall Enrolment Rates</option>
                <option value="Campus">Campus Comparisons</option>
                <option value="Course">Program Category Ratios</option>
                <option value="Counsellor">Counsellor Conversion Metrics</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Export File Format</label>
              <select
                value={reportFormat}
                onChange={e => setReportFormat(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 outline-none text-white font-medium"
              >
                <option value="CSV">Comma Separated Values (.csv)</option>
                <option value="EXCEL">Microsoft Excel Sheet (.xlsx)</option>
                <option value="PDF">Portable Document Format (.pdf)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={actionLoading || !reportTitle.trim()}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              <span>{actionLoading ? 'Compiling...' : 'Create Report'}</span>
            </button>
          </form>
        </div>

        {/* compiled logs list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-2">
            <Table className="h-4.5 w-4.5 text-emerald-400" />
            <span>Compiled Registers Database</span>
          </div>

          {loading ? (
            <div className="glass-panel p-8 text-center text-zinc-500 animate-pulse text-xs">Scanning reports archives...</div>
          ) : reports.length === 0 ? (
            <div className="glass-panel p-16 text-center text-zinc-600 text-xs">No reports compiled yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map(rep => (
                <div key={rep.id} className="glass-panel p-5 rounded-xl space-y-3 hover:border-emerald-500/20 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="h-8 w-8 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center shrink-0">
                        <FileText className="h-4.5 w-4.5 text-emerald-400" />
                      </div>
                      <span className="text-[9px] font-bold text-zinc-500 border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 rounded">
                        {rep.format}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs text-white">{rep.title}</h4>
                      <p className="text-[10px] text-zinc-500">Category: {rep.type} • By {rep.generatedBy}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-900 flex justify-between items-center text-[10px]">
                    <span className="text-zinc-500">{formatDate(rep.createdAt)}</span>
                    
                    <button
                      onClick={() => handleDownloadCsv(rep)}
                      className="flex items-center gap-1 text-emerald-400 font-bold hover:text-emerald-300 transition-colors uppercase tracking-wider text-[9px]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
