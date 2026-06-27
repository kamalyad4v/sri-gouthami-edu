'use client';

import { useEffect, useState } from 'react';
import { GraduationCap, Clock, School, ShieldAlert } from 'lucide-react';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const [progRes, campRes] = await Promise.all([
          fetch('/api/programs'),
          fetch('/api/campuses')
        ]);
        if (progRes.ok && campRes.ok) {
          setPrograms(await progRes.json());
          setCampuses(await campRes.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPrograms();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-white">
      {/* Title */}
      <div className="pb-4 border-b border-zinc-900 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Academic Programs <span className="text-xs text-zinc-500">Roster</span>
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5">Explore standard programs offered across secondary school and graduate study paths.</p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-zinc-500 animate-pulse">Loading Programs catalog...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map(prog => {
            const campus = campuses.find(c => c.id === prog.campusId);
            return (
              <div key={prog.id} className="glass-panel p-5 rounded-xl space-y-4 hover:border-emerald-500/20 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2.5 items-center">
                    <div className="h-9 w-9 glass-input rounded-lg flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-white">{prog.name}</h3>
                      <span className="text-[9px] text-zinc-500 font-medium">Duration: {prog.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-900/80 flex items-center gap-1 text-[10px] text-zinc-400">
                  <School className="h-4 w-4 text-zinc-500" />
                  <span>Campus Allotment: {campus?.name || 'Gowthami Campus'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
