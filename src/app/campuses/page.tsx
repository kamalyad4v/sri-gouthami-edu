'use client';

import { useEffect, useState } from 'react';
import { School, MapPin, Tag, Plus, Phone, Mail } from 'lucide-react';

export default function CampusesPage() {
  const [campuses, setCampuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCampuses = async () => {
      try {
        const res = await fetch('/api/campuses');
        if (res.ok) {
          setCampuses(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCampuses();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-white">
      {/* Title */}
      <div className="pb-4 border-b border-zinc-900 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Campus Inventory <span className="text-xs text-zinc-500">Overview</span>
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5">Manage and track active educational campuses affiliated with the Gowthami Group.</p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-zinc-500 animate-pulse">Loading Campuses Inventory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campuses.map(camp => (
            <div key={camp.id} className="glass-panel p-6 rounded-xl space-y-4 hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                  <div className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center">
                    <School className="h-5.5 w-5.5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{camp.name}</h3>
                    <span className="text-[10px] text-zinc-500 font-medium">{camp.type}</span>
                  </div>
                </div>

                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                  Active
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Our campus features state-of-the-art laboratory benches, modern compute networks, library databases, and dedicated career counselling cells.
              </p>

              <div className="pt-3 border-t border-zinc-900/80 space-y-2 text-[11px] text-zinc-400">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-zinc-500" />
                  <span>Address: {camp.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-zinc-500" />
                  <span>Support: +91 98480 22338</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-zinc-500" />
                  <span>Email: {camp.name.toLowerCase().replace(/\s+/g, '')}@gowthami.edu</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
