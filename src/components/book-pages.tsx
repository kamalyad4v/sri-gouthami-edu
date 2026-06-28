import React from "react";
import { 
  ArrowRight, 
  Quote, 
  Star, 
  GraduationCap, 
  FlaskConical, 
  Cpu, 
  Leaf, 
  Building2, 
  Globe2, 
  Award, 
  Users, 
  Mail, 
  MapPin, 
  Phone, 
  School,
  Compass
} from "lucide-react";

interface OverlineProps {
  children: React.ReactNode;
  num?: string;
}

const Overline = ({ children, num }: OverlineProps) => (
  <div className="flex items-center gap-3 mb-6">
    {num && <span className="font-serif italic text-terracotta text-base">{num}</span>}
    <span className="h-px w-8 bg-terracotta/60" />
    <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-terracotta">
      {children}
    </span>
  </div>
);

interface PageFrameProps {
  children: React.ReactNode;
  side?: "left" | "right";
  testId?: string;
}

const PageFrame = ({ children, side = "right", testId }: PageFrameProps) => (
  <div
    data-testid={testId}
    className={`absolute inset-0 paper-texture flex flex-col overflow-hidden ${
      side === "right" ? "page-shadow-left" : "page-shadow-right"
    }`}
  >
    {children}
  </div>
);

const PageNumber = ({ n }: { n: string }) => (
  <div className="absolute bottom-5 right-7 font-serif italic text-ink/40 text-sm select-none">{n}</div>
);

/* ============ COVER ============ */
export const CoverFront = () => (
  <div data-testid="page-cover" className="absolute inset-0 book-cover flex flex-col items-center justify-center text-paper overflow-hidden">
    <div className="absolute inset-5 sm:inset-7 border border-paper/15 rounded-sm pointer-events-none" />
    <div className="absolute inset-7 sm:inset-10 border border-paper/10 rounded-sm pointer-events-none" />
    <div className="relative flex flex-col items-center text-center px-6 sm:px-12">
      <div className="text-[10px] sm:text-xs uppercase tracking-[0.38em] text-terracotta-soft mb-6 sm:mb-8 font-sans font-bold">
        Est. 1996  ·  Vol. XXX
      </div>
      <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight font-bold">
        Sri Gowthami<br />
        <span className="italic font-light">Educational</span><br />
        Group
      </h1>
      <div className="mt-7 sm:mt-10 h-px w-16 bg-terracotta-soft" />
      <p className="mt-6 font-serif italic text-paper/70 text-sm sm:text-base max-w-xs">
        A field guide to holistic learning,<br />from schooling to PG collegiate courses.
      </p>
      <div className="mt-10 sm:mt-14 text-[10px] uppercase tracking-[0.34em] text-paper/50 animate-float-up font-sans font-bold">
        Scroll to open ↓
      </div>
    </div>
  </div>
);

export const CoverBack = () => (
  <PageFrame side="left" testId="page-intro-left">
    <div className="flex-1 flex flex-col justify-center px-8 sm:px-14">
      <Overline num="i.">Foreword</Overline>
      <p className="font-serif italic text-ink/75 text-lg sm:text-xl leading-relaxed max-w-md">
        “Within these pages, you will not find just classrooms.<br />
        You will find a student's journey — built, nurtured, and realized.”
      </p>
      <div className="mt-8 text-xs uppercase tracking-[0.24em] text-ink/45 font-sans font-bold">
        — From the Director&apos;s Desk
      </div>
    </div>
    <PageNumber n="i" />
  </PageFrame>
);

/* ============ HERO ============ */
export const HeroRight = () => (
  <PageFrame side="right" testId="page-hero">
    <div className="flex-1 flex flex-col justify-center px-8 sm:px-14">
      <Overline num="01.">Chapter One — The Invitation</Overline>
      <h2 className="font-serif text-[40px] sm:text-[56px] md:text-[62px] leading-[0.98] tracking-tight text-forest font-bold">
        Build a<br />
        <span className="italic font-light">foundation</span><br />
        for success.
      </h2>
      <p className="mt-6 sm:mt-8 text-ink/70 text-[14px] sm:text-base leading-relaxed max-w-md">
        Sri Gowthami is a premium group of institutions operating multiple specialized campuses in AP, dedicated to nurturing competitive training with core academic board excellence.
      </p>
      <div className="mt-8 sm:mt-10 flex flex-wrap gap-3">
        <a href="#programs" data-testid="hero-explore-button" className="group inline-flex items-center gap-2 bg-forest hover:bg-forest-deep text-paper rounded-full px-6 py-3 text-xs font-bold tracking-wide transition-all duration-300 hover:-translate-y-[1px] hover:shadow-lg uppercase font-sans">
          Explore Programs
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
        <a href="#admissions" data-testid="hero-apply-button" className="inline-flex items-center gap-2 border border-forest/30 text-forest hover:border-forest hover:bg-forest/[0.03] rounded-full px-6 py-3 text-xs font-bold tracking-wide transition-all duration-300 uppercase font-sans">
          Begin Application
        </a>
      </div>
      <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
        {[{ k: "30+", l: "Years" }, { k: "4", l: "Campuses" }, { k: "15k+", l: "Alumni" }].map((s) => (
          <div key={s.l}>
            <div className="font-serif text-3xl text-forest font-bold">{s.k}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink/50 mt-1 font-sans font-bold">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
    <PageNumber n="01" />
  </PageFrame>
);

export const HeroLeft = () => (
  <PageFrame side="left" testId="page-hero-left">
    <div className="flex-1 relative overflow-hidden">
      <img src="/school.png" alt="Sri Gowthami School Campus" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/60 via-forest-deep/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 text-paper">
        <div className="text-[10px] uppercase tracking-[0.32em] text-paper/70 mb-2 font-sans font-bold">Plate I.</div>
        <div className="font-serif italic text-lg sm:text-xl leading-snug max-w-xs">
          The Kakinada Main Campus, offering foundational schooling.
        </div>
      </div>
    </div>
  </PageFrame>
);

/* ============ FEATURES ============ */
export const FeaturesRight = () => {
  const items = [
    { icon: School, title: "Foundational Schooling", desc: "Play school to Class 10 CBSE/State Board syllabus, focused on core basics." },
    { icon: GraduationCap, title: "Junior Colleges", desc: "Intermediate streams in MPC & BiPC with structured IIT-JEE / NEET coaching." },
    { icon: Award, title: "Degree & PG Colleges", desc: "Undergraduate science & commerce degree programs (B.Sc CS, B.Com Computers)." },
    { icon: Compass, title: "ITI & Technical", desc: "Practical trades training (Electrician, Fitter) with immediate job placement assistance." },
  ];
  return (
    <PageFrame side="right" testId="page-features">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-14">
        <Overline num="02.">Chapter Two — The Campuses</Overline>
        <h2 className="font-serif text-[34px] sm:text-[44px] leading-[1.02] tracking-tight text-forest font-bold">
          Four campuses.<br />
          <span className="italic font-light">One educational path.</span>
        </h2>
        <p className="mt-4 text-ink/65 text-[14px] sm:text-[15px] leading-relaxed max-w-md">
          Operating dedicated campuses with the vision of offering high-quality, continuous learning across regions.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} data-testid={`feature-${title.toLowerCase().replace(/\s|&/g, "-")}`} className="group">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-terracotta shrink-0" strokeWidth={1.7} />
                <h3 className="font-serif text-lg text-forest font-bold">{title}</h3>
              </div>
              <p className="text-[12px] text-ink/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
      <PageNumber n="02" />
    </PageFrame>
  );
};

export const FeaturesLeft = () => (
  <PageFrame side="left" testId="page-features-left">
    <div className="flex-1 relative overflow-hidden">
      <img src="/junior_college.png" alt="Sri Gowthami Junior College" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-forest-deep/50" />
      <div className="absolute top-0 left-0 right-0 p-8 sm:p-12 text-paper">
        <div className="text-[10px] uppercase tracking-[0.32em] text-paper/80 mb-2 font-sans font-bold">Plate II.</div>
        <div className="font-serif italic text-lg sm:text-xl leading-snug max-w-xs">
          The Rajahmundry Intermediate Unit — specialized in IIT-JEE & board excellence.
        </div>
      </div>
    </div>
  </PageFrame>
);

/* ============ REVIEWS ============ */
export const ReviewsRight = () => {
  const reviews = [
    { quote: "The transparency in fee tracking and document updates is unmatched. Being able to track my son's verification status live saved me multiple trips to the campus.", name: "Srinivas Varma", role: "Parent, CSE" },
    { quote: "Sri Gowthami's integrated JEE coaching was crucial for my rank. The digital admissions desk and counselor guidance made stream selection simple.", name: "Aditya Varma", role: "Student, Class of '24" },
    { quote: "Managing admissions enquiries across 4 distinct campuses used to be a logistical nightmare. The unified console has streamlined student follow-ups to minutes.", name: "Prof. Krishna Rao", role: "Senior Faculty" },
  ];
  return (
    <PageFrame side="right" testId="page-reviews">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-14">
        <Overline num="03.">Chapter Three — Voices</Overline>
        <h2 className="font-serif text-[34px] sm:text-[44px] leading-[1.02] tracking-tight text-forest font-bold">
          Letters from the<br />
          <span className="italic font-light">community.</span>
        </h2>
        <div className="mt-8 space-y-7">
          {reviews.map((r, i) => (
            <figure key={i} data-testid={`review-${i}`} className="border-l-2 border-terracotta/60 pl-5">
              <Quote className="w-4 h-4 text-terracotta mb-2" strokeWidth={1.8} />
              <blockquote className="font-serif italic text-ink/80 text-[13.5px] sm:text-[14.5px] leading-relaxed">“{r.quote}”</blockquote>
              <figcaption className="mt-2.5 flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-terracotta text-terracotta" />)}
                </div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-ink/55 font-sans font-bold">{r.name} · {r.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <PageNumber n="03" />
    </PageFrame>
  );
};

export const ReviewsLeft = () => (
  <PageFrame side="left" testId="page-reviews-left">
    <div className="flex-1 relative overflow-hidden">
      <img src="/degree_college.png" alt="Degree college library" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/55 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 text-paper">
        <div className="text-[10px] uppercase tracking-[0.32em] text-paper/80 mb-2 font-sans font-bold">Plate III.</div>
        <div className="font-serif italic text-lg sm:text-xl leading-snug max-w-xs">
          Study hour in the Amalapuram Collegiate Library.
        </div>
      </div>
    </div>
  </PageFrame>
);

/* ============ WHY CHOOSE US ============ */
export const WhyRight = () => {
  const reasons = [
    { icon: Award, title: "30+ Years Excellence", desc: "A trusted household name in Andhra Pradesh offering stable academic environments since 1996." },
    { icon: Globe2, title: "Specialized Coaching", desc: "Rigorous competitive exam integration for IIT-JEE, NEET, and local engineering entrance EAPCET." },
    { icon: Users, title: "Industry-Aligned ITI", desc: "Direct placement assistance and practical apprenticeship models with heavy engineering firms." },
    { icon: Building2, title: "Luminous Facilities", desc: "State-of-the-art computer centers, smart classroom structures, and extensive libraries." },
  ];
  return (
    <PageFrame side="right" testId="page-why">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-14">
        <Overline num="04.">Chapter Four — On Choosing</Overline>
        <h2 className="font-serif text-[34px] sm:text-[44px] leading-[1.02] tracking-tight text-forest font-bold">
          Why Sri Gowthami,<br />
          <span className="italic font-light">and why now.</span>
        </h2>
        <p className="mt-4 text-ink/65 text-[14px] sm:text-[15px] leading-relaxed max-w-md">
          Four reasons — among many — that parents and students choose our institutions year after year.
        </p>
        <div className="mt-8 space-y-5">
          {reasons.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} data-testid={`reason-${i}`} className="flex gap-4 items-start">
              <div className="shrink-0 w-9 h-9 rounded-full bg-forest/8 border border-forest/15 flex items-center justify-center mt-0.5">
                <Icon className="w-4 h-4 text-forest" strokeWidth={1.7} />
              </div>
              <div>
                <div className="font-serif text-lg text-forest leading-tight font-bold">{title}</div>
                <p className="text-[12.5px] text-ink/65 leading-relaxed mt-0.5 max-w-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <PageNumber n="04" />
    </PageFrame>
  );
};

export const WhyLeft = () => (
  <PageFrame side="left" testId="page-why-left">
    <div className="flex-1 relative overflow-hidden">
      <img src="/technical_institute.png" alt="Practical technical programs" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/60 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 text-paper">
        <div className="text-[10px] uppercase tracking-[0.32em] text-paper/80 mb-2 font-sans font-bold">Plate IV.</div>
        <div className="font-serif italic text-lg sm:text-xl leading-snug max-w-xs">
          The Visakhapatnam ITI workshop — training mechanics of the future.
        </div>
      </div>
    </div>
  </PageFrame>
);

/* ============ FOOTER ============ */
export const FooterRight = () => (
  <PageFrame side="right" testId="page-footer">
    <div className="flex-1 flex flex-col px-8 sm:px-14 py-10 sm:py-14">
      <Overline num="V.">Colophon</Overline>
      <h2 className="font-serif text-[30px] sm:text-[40px] leading-[1.02] tracking-tight text-forest font-bold">
        Begin your<br />
        <span className="italic font-light">chapter.</span>
      </h2>
      <div className="mt-6 flex flex-col gap-3 text-[13px] text-ink/75">
        <div className="flex items-center gap-2.5"><Mail className="w-3.5 h-3.5 text-terracotta" />admissions@sgowthami.edu.in</div>
        <div className="flex items-center gap-2.5"><Phone className="w-3.5 h-3.5 text-terracotta" />+91 98480 22338</div>
        <div className="flex items-center gap-2.5"><MapPin className="w-3.5 h-3.5 text-terracotta" />Rajahmundry Road, Andhra Pradesh, India</div>
      </div>
      <a href="/auth/sign-in" data-testid="footer-apply-button" className="mt-8 inline-flex items-center gap-2 bg-forest hover:bg-forest-deep text-paper rounded-full px-6 py-3 text-xs font-bold tracking-wide self-start transition-all duration-300 hover:-translate-y-[1px] hover:shadow-lg group uppercase font-sans">
        Apply Now for 2026-27
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </a>
      <div className="mt-auto pt-8 border-t border-ink/10 flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.2em] text-ink/45 font-sans font-bold">© Sri Gowthami 2026</div>
        <div className="flex gap-3 text-ink/55">
          {/* Instagram */}
          <a href="#" data-testid="footer-social-0" className="hover:text-forest transition-colors animate-pulse" aria-label="instagram">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          {/* LinkedIn */}
          <a href="#" data-testid="footer-social-1" className="hover:text-forest transition-colors animate-pulse" aria-label="linkedin">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          {/* Twitter */}
          <a href="#" data-testid="footer-social-2" className="hover:text-forest transition-colors animate-pulse" aria-label="twitter">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
          </a>
          {/* YouTube */}
          <a href="#" data-testid="footer-social-3" className="hover:text-forest transition-colors animate-pulse" aria-label="youtube">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </PageFrame>
);

export const FooterLeft = () => (
  <PageFrame side="left" testId="page-footer-left">
    <div className="flex-1 flex flex-col justify-center px-8 sm:px-14">
      <Overline>Closing Note</Overline>
      <p className="font-serif italic text-ink/75 text-lg sm:text-xl leading-relaxed max-w-sm">
        “A college is not a destination. It is a manner of attention — practiced daily, in small rooms, with dedicated books.”
      </p>
      <div className="mt-6 text-[11px] uppercase tracking-[0.24em] text-ink/45 font-sans font-bold">
        — Founder&apos;s Address, 1996
      </div>
      <div className="mt-12">
        <div className="text-[10px] uppercase tracking-[0.28em] text-terracotta mb-3 font-sans font-bold">Quick Index</div>
        <ul className="space-y-1.5 text-[13px] text-ink/70 font-medium">
          <li><a href="#programs" className="hover:text-forest transition-colors">Campuses & Streams</a></li>
          <li><a href="#features" className="hover:text-forest transition-colors">Console Features</a></li>
          <li><a href="#testimonials" className="hover:text-forest transition-colors">Voices</a></li>
          <li><a href="/auth/sign-in" className="hover:text-forest transition-colors font-semibold text-forest">Admissions Console</a></li>
        </ul>
      </div>
    </div>
    <PageNumber n="V" />
  </PageFrame>
);

export const BackCover = () => (
  <div data-testid="page-back-cover" className="absolute inset-0 book-cover flex items-center justify-center text-paper">
    <div className="absolute inset-5 sm:inset-7 border border-paper/15 rounded-sm" />
    <div className="text-center px-8">
      <div className="font-serif text-2xl sm:text-3xl italic font-bold">— Fin —</div>
      <div className="mt-6 text-[10px] uppercase tracking-[0.32em] text-paper/55 font-sans font-bold">Sri Gowthami Group of Institutions</div>
    </div>
  </div>
);
