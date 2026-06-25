'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { CourseRecommendation } from '@/lib/ai-service';
import {
  BookOpen,
  Sparkles,
  Award,
  GraduationCap,
  MapPin,
  CheckCircle,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'CATALOG' | 'AI_ADVISOR'>('CATALOG');

  // AI Recommender states
  const [academicBackground, setAcademicBackground] = useState('');
  const [interests, setInterests] = useState('');
  const [careerGoals, setCareerGoals] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ recommendations: CourseRecommendation[]; summary: string } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [courRes, campRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/campuses')
      ]);
      if (courRes.ok && campRes.ok) {
        setCourses(await courRes.json());
        setCampuses(await campRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLaunchAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!academicBackground.trim() || !interests.trim() || !careerGoals.trim()) return;

    setAiLoading(true);
    setAiError(null);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ academicBackground, interests, careerGoals })
      });

      if (!res.ok) {
        throw new Error('Failed to compute course recommendations.');
      }

      const data = await res.json();
      setAiResult(data);
    } catch (err: any) {
      setAiError(err.message || 'An error occurred during scanning.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-white">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-900 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Course Catalogue & Advising Desk <span className="text-xs text-zinc-500">Inventory</span>
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5">Explore institutional courses stream details or queries the heuristic academic advising engine.</p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-lg self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('CATALOG')}
            className={cn(
              "px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5",
              activeTab === 'CATALOG' ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/10" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Programs Catalog</span>
          </button>
          <button
            onClick={() => setActiveTab('AI_ADVISOR')}
            className={cn(
              "px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5",
              activeTab === 'AI_ADVISOR' ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/10" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>AI Admission Advisor</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-zinc-500 animate-pulse">Loading catalogue items...</div>
      ) : (
        <>
          {activeTab === 'CATALOG' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map(course => {
                const camp = campuses.find(cam => cam.id === (course.program?.campusId || course.programId));
                return (
                  <div key={course.id} className="glass-panel p-6 rounded-xl space-y-4 hover:border-emerald-500/25 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <div className="h-9 w-9 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white">{course.name}</h3>
                          <span className="text-[10px] text-zinc-500">{course.program?.name || 'Curriculum Stream'}</span>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-extrabold text-sm">{formatCurrency(course.fees)} / Year</span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">{course.description}</p>

                    <div className="pt-3 border-t border-zinc-900/60 grid grid-cols-2 gap-2 text-[10px] text-zinc-500 uppercase font-semibold">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-zinc-600" />
                        <span>Eligibility: {course.eligibility}</span>
                      </div>
                      {camp && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-zinc-600" />
                          <span>Campus: {camp.name.split(' ')[2] || camp.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'AI_ADVISOR' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Questionnaire Form */}
              <div className="glass-panel p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <HelpCircle className="h-4.5 w-4.5 text-emerald-400" />
                  <span>Academic Advisory Wizard</span>
                </div>

                <form onSubmit={handleLaunchAdvisor} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase block">Previous Academic Background</label>
                    <textarea
                      placeholder="e.g. Scored 9.2 GPA in SSC 10th class standard board exams. Interested in math-intensive logic streams..."
                      value={academicBackground}
                      onChange={e => setAcademicBackground(e.target.value)}
                      className="w-full h-20 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500 resize-none transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase block">Core Interests & Hobbies</label>
                    <textarea
                      placeholder="e.g. Computer games, coding basic programs, assembling electronic kits, playing sports..."
                      value={interests}
                      onChange={e => setInterests(e.target.value)}
                      className="w-full h-20 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500 resize-none transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase block">Target Career & Life Goals</label>
                    <textarea
                      placeholder="e.g. Seek a job in local railways or tech startup. Want to pursue higher university education in tech..."
                      value={careerGoals}
                      onChange={e => setCareerGoals(e.target.value)}
                      className="w-full h-20 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500 resize-none transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10"
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Evaluating suitability...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Evaluate Course Suitability</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Analysis Result */}
              <div className="lg:col-span-2 space-y-4">
                {aiLoading && (
                  <div className="glass-panel p-8 text-center text-zinc-500 animate-pulse text-xs">
                    Adviser parsing inputs tags matching institutional criteria lists...
                  </div>
                )}

                {aiError && (
                  <div className="glass-panel p-6 border border-rose-500/20 bg-rose-950/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                    <span>{aiError}</span>
                  </div>
                )}

                {!aiLoading && !aiResult && !aiError && (
                  <div className="glass-panel p-16 text-center text-zinc-600 text-xs">
                    Submit the questionnaire on the left to activate heuristic suitability report.
                  </div>
                )}

                {aiResult && (
                  <div className="space-y-6">
                    {/* Summary Card */}
                    <div className="glass-panel p-5 rounded-xl border border-emerald-500/20 bg-emerald-950/5 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <Award className="h-4 w-4" />
                        <span>Adviser Diagnostic Summary</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-medium">{aiResult.summary}</p>
                    </div>

                    {/* Recommendation list */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Identified Matches</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {aiResult.recommendations.map((rec, i) => (
                          <div key={i} className="glass-panel p-5 rounded-xl space-y-4 hover:border-emerald-500/20 transition-all">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-xs text-white">{rec.courseName}</h4>
                                <span className="text-[10px] text-zinc-500">{rec.campusName}</span>
                              </div>

                              <span className="text-emerald-400 font-extrabold text-sm">{rec.suitabilityScore}% Suitability Match</span>
                            </div>

                            <p className="text-xs text-zinc-400 leading-relaxed">{rec.explanation}</p>

                            <div className="pt-2 border-t border-zinc-900/60">
                              <h5 className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Suitable Career Pathways</h5>
                              <div className="flex flex-wrap gap-1.5">
                                {rec.careerPath.map(car => (
                                  <span key={car} className="text-[10px] text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                                    {car}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
