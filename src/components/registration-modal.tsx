"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface Campus {
  id: string;
  name: string;
  type: string;
  address: string;
}

interface Program {
  id: string;
  name: string;
  duration: string;
  campusId: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
  fees: number;
  programId: string;
}

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [studentName, setStudentName] = useState("");
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [campusId, setCampusId] = useState("");
  const [programId, setProgramId] = useState("");
  const [courseId, setCourseId] = useState("");

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setError(null);
    Promise.all([
      fetch("/api/campuses").then(res => {
        if (!res.ok) throw new Error("Failed to fetch campuses");
        return res.json();
      }),
      fetch("/api/programs").then(res => {
        if (!res.ok) throw new Error("Failed to fetch programs");
        return res.json();
      }),
      fetch("/api/courses").then(res => {
        if (!res.ok) throw new Error("Failed to fetch courses");
        return res.json();
      })
    ])
      .then(([campusesData, programsData, coursesData]) => {
        setCampuses(campusesData);
        setPrograms(programsData);
        setCourses(coursesData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading registration data:", err);
        setError("Could not load registration parameters. Please try again.");
        setLoading(false);
      });
  }, [isOpen]);

  // Dynamic lists based on selections
  const filteredPrograms = programs.filter(p => p.campusId === campusId);
  const filteredCourses = courses.filter(c => c.programId === programId);

  // Reset dependent fields when parent fields change
  const handleCampusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCampusId(e.target.value);
    setProgramId("");
    setCourseId("");
  };

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProgramId(e.target.value);
    setCourseId("");
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!studentName.trim()) errs.studentName = "Student name is required";
    if (!parentName.trim()) errs.parentName = "Parent/Guardian name is required";
    
    if (!email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!mobile.trim()) {
      errs.mobile = "Mobile number is required";
    } else if (!/^\+?[0-9]{10,14}$/.test(mobile.replace(/[\s-]/g, ""))) {
      errs.mobile = "Please enter a valid mobile number";
    }

    if (!campusId) errs.campusId = "Please select a campus";
    if (!programId) errs.programId = "Please select a program";
    if (!courseId) errs.courseId = "Please select a course";

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentName,
          parentName,
          email,
          mobile,
          address,
          campusId,
          programId,
          courseId
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong during registration.");
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStudentName("");
    setParentName("");
    setEmail("");
    setMobile("");
    setAddress("");
    setCampusId("");
    setProgramId("");
    setCourseId("");
    setSubmitSuccess(false);
    setError(null);
    setValidationErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#121B17]/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            className="relative w-full max-w-lg bg-[#FDFBF7] border border-forest/15 shadow-[0_20px_50px_rgba(27,59,43,0.15)] rounded-2xl p-6 sm:p-8 overflow-y-auto max-h-[85vh] select-text z-10 paper-texture"
          >
            {/* Header Spine-like top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-terracotta/40 via-forest/40 to-terracotta/40 rounded-t-2xl" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-ink/40 hover:text-forest hover:bg-forest/5 p-2 rounded-full transition-all duration-200 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              /* Success State */
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center text-forest mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl text-forest font-bold mb-3">
                  Registration Successful
                </h3>
                <p className="font-serif italic text-ink/70 text-base leading-relaxed max-w-sm mb-8">
                  Thank you for starting your chapter with Sri Gowthami. Our admissions counsellor will connect with you shortly.
                </p>
                <button
                  onClick={handleReset}
                  className="bg-forest hover:bg-forest-deep text-paper font-sans text-xs uppercase font-bold tracking-wide py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-[1px] active:translate-y-0 cursor-pointer"
                >
                  Return to Brochure
                </button>
              </div>
            ) : (
              /* Registration Form */
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-6 h-6 rounded-full bg-forest/10 text-forest flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.24em] text-terracotta uppercase font-sans">
                    Sri Gowthami Admissions
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-forest font-bold mb-1">
                  Begin your journey.
                </h3>
                <p className="font-serif italic text-ink/60 text-sm mb-6">
                  Fill in your details below to register for the 2026-27 academic year.
                </p>

                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200/50 flex items-start gap-2.5 text-xs text-red-700 font-sans leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-ink/50">
                    <Loader2 className="w-8 h-8 animate-spin text-forest mb-4" />
                    <span className="font-serif italic text-sm">Preparing registration desk...</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Student Name */}
                    <div>
                      <label htmlFor="studentName" className="block text-[11px] font-bold uppercase tracking-wider text-ink/70 mb-1.5 font-sans">
                        Student Full Name *
                      </label>
                      <input
                        id="studentName"
                        type="text"
                        value={studentName}
                        onChange={e => setStudentName(e.target.value)}
                        className={`w-full bg-[#FAF8F5] border ${
                          validationErrors.studentName ? "border-red-400 focus:ring-red-400" : "border-forest/15 focus:ring-forest"
                        } rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:ring-1 focus:border-transparent transition-all duration-200`}
                        placeholder="Enter student name"
                      />
                      {validationErrors.studentName && (
                        <p className="text-[10px] text-red-500 mt-1 font-sans font-medium">{validationErrors.studentName}</p>
                      )}
                    </div>

                    {/* Parent Name */}
                    <div>
                      <label htmlFor="parentName" className="block text-[11px] font-bold uppercase tracking-wider text-ink/70 mb-1.5 font-sans">
                        Parent / Guardian Name *
                      </label>
                      <input
                        id="parentName"
                        type="text"
                        value={parentName}
                        onChange={e => setParentName(e.target.value)}
                        className={`w-full bg-[#FAF8F5] border ${
                          validationErrors.parentName ? "border-red-400 focus:ring-red-400" : "border-forest/15 focus:ring-forest"
                        } rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:ring-1 focus:border-transparent transition-all duration-200`}
                        placeholder="Enter parent/guardian name"
                      />
                      {validationErrors.parentName && (
                        <p className="text-[10px] text-red-500 mt-1 font-sans font-medium">{validationErrors.parentName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email Address */}
                      <div>
                        <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-ink/70 mb-1.5 font-sans">
                          Email Address *
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className={`w-full bg-[#FAF8F5] border ${
                            validationErrors.email ? "border-red-400 focus:ring-red-400" : "border-forest/15 focus:ring-forest"
                          } rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:ring-1 focus:border-transparent transition-all duration-200`}
                          placeholder="email@example.com"
                        />
                        {validationErrors.email && (
                          <p className="text-[10px] text-red-500 mt-1 font-sans font-medium">{validationErrors.email}</p>
                        )}
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label htmlFor="mobile" className="block text-[11px] font-bold uppercase tracking-wider text-ink/70 mb-1.5 font-sans">
                          Mobile Number *
                        </label>
                        <input
                          id="mobile"
                          type="tel"
                          value={mobile}
                          onChange={e => setMobile(e.target.value)}
                          className={`w-full bg-[#FAF8F5] border ${
                            validationErrors.mobile ? "border-red-400 focus:ring-red-400" : "border-forest/15 focus:ring-forest"
                          } rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:ring-1 focus:border-transparent transition-all duration-200`}
                          placeholder="10-digit mobile number"
                        />
                        {validationErrors.mobile && (
                          <p className="text-[10px] text-red-500 mt-1 font-sans font-medium">{validationErrors.mobile}</p>
                        )}
                      </div>
                    </div>

                    {/* Address (Optional) */}
                    <div>
                      <label htmlFor="address" className="block text-[11px] font-bold uppercase tracking-wider text-ink/70 mb-1.5 font-sans">
                        Residential Address (Optional)
                      </label>
                      <textarea
                        id="address"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        rows={2}
                        className="w-full bg-[#FAF8F5] border border-forest/15 focus:ring-forest rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:ring-1 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Enter full address"
                      />
                    </div>

                    {/* Campus Dropdown */}
                    <div>
                      <label htmlFor="campus" className="block text-[11px] font-bold uppercase tracking-wider text-ink/70 mb-1.5 font-sans">
                        Select Campus *
                      </label>
                      <select
                        id="campus"
                        value={campusId}
                        onChange={handleCampusChange}
                        className={`w-full bg-[#FAF8F5] border ${
                          validationErrors.campusId ? "border-red-400 focus:ring-red-400" : "border-forest/15 focus:ring-forest"
                        } rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:ring-1 focus:border-transparent transition-all duration-200 cursor-pointer`}
                      >
                        <option value="">-- Choose Campus --</option>
                        {campuses.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {validationErrors.campusId && (
                        <p className="text-[10px] text-red-500 mt-1 font-sans font-medium">{validationErrors.campusId}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Program Dropdown */}
                      <div>
                        <label htmlFor="program" className="block text-[11px] font-bold uppercase tracking-wider text-ink/70 mb-1.5 font-sans">
                          Select Program *
                        </label>
                        <select
                          id="program"
                          value={programId}
                          onChange={handleProgramChange}
                          disabled={!campusId}
                          className={`w-full bg-[#FAF8F5] border ${
                            validationErrors.programId ? "border-red-400 focus:ring-red-400" : "border-forest/15 focus:ring-forest"
                          } rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:ring-1 focus:border-transparent transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <option value="">-- Choose Program --</option>
                          {filteredPrograms.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        {validationErrors.programId && (
                          <p className="text-[10px] text-red-500 mt-1 font-sans font-medium">{validationErrors.programId}</p>
                        )}
                      </div>

                      {/* Course Dropdown */}
                      <div>
                        <label htmlFor="course" className="block text-[11px] font-bold uppercase tracking-wider text-ink/70 mb-1.5 font-sans">
                          Select Course *
                        </label>
                        <select
                          id="course"
                          value={courseId}
                          onChange={e => setCourseId(e.target.value)}
                          disabled={!programId}
                          className={`w-full bg-[#FAF8F5] border ${
                            validationErrors.courseId ? "border-red-400 focus:ring-red-400" : "border-forest/15 focus:ring-forest"
                          } rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:ring-1 focus:border-transparent transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <option value="">-- Choose Course --</option>
                          {filteredCourses.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        {validationErrors.courseId && (
                          <p className="text-[10px] text-red-500 mt-1 font-sans font-medium">{validationErrors.courseId}</p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-4 w-full bg-forest hover:bg-forest-deep text-paper font-sans text-[11px] uppercase font-bold tracking-wider py-3 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Submitting Registration...
                        </>
                      ) : (
                        "Submit Registration"
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
