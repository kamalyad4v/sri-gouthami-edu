"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import BookNavbar from "./book-navbar";
import {
  CoverFront, HeroLeft, HeroRight,
  FeaturesLeft, FeaturesRight,
  ReviewsLeft, ReviewsRight,
  WhyLeft, WhyRight,
  FooterLeft, FooterRight,
} from "./book-pages";

const SHEETS = [
  { id: "cover", Front: CoverFront, Back: HeroLeft },
  { id: "hero", Front: HeroRight, Back: FeaturesLeft },
  { id: "features", Front: FeaturesRight, Back: ReviewsLeft },
  { id: "reviews", Front: ReviewsRight, Back: WhyLeft },
  { id: "why", Front: WhyRight, Back: FooterLeft },
];

const FLIP_START = 0.06;
const FLIP_END = 0.96;

interface SheetProps {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  Front: React.ComponentType;
  Back: React.ComponentType;
}

const Sheet = ({ index, total, scrollYProgress, Front, Back }: SheetProps) => {
  const segment = (FLIP_END - FLIP_START) / total;
  const start = FLIP_START + index * segment;
  const end = start + segment;

  const rotateY = useTransform(scrollYProgress, [start, end], [0, -180], { clamp: true });
  const smoothRotate = useSpring(rotateY, { stiffness: 85, damping: 24, mass: 0.6 });
  const lift = useTransform(smoothRotate, [0, -90, -180], [0, 18, 0]);
  const shadowOpacity = useTransform(smoothRotate, [0, -90, -180], [0, 0.35, 0]);

  return (
    <motion.div
      data-testid={`sheet-${index}`}
      className="absolute top-0 right-0 w-1/2 h-full preserve-3d"
      style={{
        transformOrigin: "left center",
        rotateY: smoothRotate,
        translateZ: lift,
        zIndex: 100 - index,
      }}
    >
      <div className="absolute inset-0 backface-hidden overflow-hidden" style={{ transform: "rotateY(0deg)" }}>
        <Front />
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(to left, rgba(0,0,0,0.25), rgba(0,0,0,0) 35%)",
            opacity: shadowOpacity,
          }}
        />
      </div>
      <div className="absolute inset-0 backface-hidden overflow-hidden" style={{ transform: "rotateY(180deg)" }}>
        <Back />
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.22), rgba(0,0,0,0) 35%)",
            opacity: shadowOpacity,
          }}
        />
      </div>
    </motion.div>
  );
};

const CHAPTERS = ["Cover", "Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Footer"];

interface ChapterDotProps {
  scrollYProgress: MotionValue<number>;
  t: number;
  label: string;
}

const ChapterDot = ({ scrollYProgress, t, label }: ChapterDotProps) => {
  const opacity = useTransform(scrollYProgress, (v) => Math.max(0.3, 1 - Math.abs(v - t) * 5));
  const dotScale = useTransform(scrollYProgress, (v) => (Math.abs(v - t) < 0.08 ? 1.3 : 0.9));
  
  return (
    <motion.div className="flex items-center gap-3 cursor-pointer" style={{ opacity }}>
      <span className="text-[10px] uppercase tracking-[0.24em] text-ink/70 font-bold font-sans">{label}</span>
      <motion.span className="block w-1.5 h-1.5 rounded-full bg-forest" style={{ scale: dotScale }} />
    </motion.div>
  );
};

const ChapterIndicator = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => (
  <div
    data-testid="chapter-indicator"
    className="fixed right-5 sm:right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-3 select-none"
  >
    {CHAPTERS.map((c, i) => (
      <ChapterDot key={c} scrollYProgress={scrollYProgress} t={i / (CHAPTERS.length - 1)} label={c} />
    ))}
  </div>
);

const ScrollHint = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
  const opacity = useTransform(scrollYProgress, [0, 0.04, 0.08], [1, 1, 0]);
  return (
    <motion.div
      data-testid="scroll-hint"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none"
      style={{ opacity }}
    >
      <span className="text-[10px] uppercase tracking-[0.32em] text-ink/55 font-bold font-sans">
        Scroll to turn the page
      </span>
      <div className="w-px h-10 bg-gradient-to-b from-ink/40 to-transparent" />
    </motion.div>
  );
};

export const BookLanding = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const handleApply = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div ref={wrapperRef} className="relative w-full" style={{ height: "650vh" }}>
      <BookNavbar onApplyClick={handleApply} />
      <ChapterIndicator scrollYProgress={scrollYProgress} />
      <ScrollHint scrollYProgress={scrollYProgress} />

      <div className="sticky top-0 h-screen w-full overflow-hidden scene-vignette">
        {/* Background Vignette Text Plates */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-24 left-8 sm:left-14 hidden lg:block">
            <div className="text-[10px] uppercase tracking-[0.34em] text-ink/45 font-sans font-bold">Sri Gowthami · Brochure</div>
            <div className="font-serif italic text-ink/55 text-sm mt-1">An Interactive Presentation</div>
          </div>
          <div className="absolute bottom-8 left-8 sm:left-14 hidden lg:block">
            <div className="text-[10px] uppercase tracking-[0.34em] text-ink/40 font-sans font-bold">MMXXVI · Edition One</div>
          </div>
        </div>

        <div className="relative w-full h-full flex items-center justify-center px-4 sm:px-10">
          <div
            data-testid="book"
            className="relative w-full max-w-[1100px] aspect-[16/10] perspective-book"
            style={{ perspective: "2800px" }}
          >
            {/* Book bottom shadow */}
            <div className="absolute -bottom-4 left-[6%] right-[6%] h-6 rounded-[50%] blur-2xl bg-black/20 pointer-events-none" aria-hidden />

            <div className="absolute inset-0 preserve-3d" style={{ transformStyle: "preserve-3d" }}>
              {/* LEFT static base (Preambule) */}
              <div
                data-testid="book-left-page"
                className="absolute top-0 left-0 w-1/2 h-full paper-texture overflow-hidden page-shadow-right"
              >
                <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-14">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-terracotta mb-4 font-sans font-bold">Introduction</div>
                  <p className="font-serif italic text-ink/65 text-base sm:text-lg leading-relaxed max-w-xs">
                    Open the brochure. Turn the pages.
                    <br />
                    Discover thirty years of educational distinction.
                  </p>
                </div>
              </div>

              {/* RIGHT static base = footer right */}
              <div
                data-testid="book-right-base"
                className="absolute top-0 right-0 w-1/2 h-full overflow-hidden"
                style={{ zIndex: 0 }}
              >
                <FooterRight />
              </div>

              {/* Spine */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-full book-spine pointer-events-none"
                style={{ zIndex: 200 }}
                aria-hidden
              />

              {/* Flipping sheets */}
              {SHEETS.map((s, i) => (
                <Sheet
                  key={s.id}
                  index={i}
                  total={SHEETS.length}
                  scrollYProgress={scrollYProgress}
                  Front={s.Front}
                  Back={s.Back}
                />
              ))}

              <div className="absolute inset-0 rounded-[2px] ring-1 ring-black/[0.04] pointer-events-none" style={{ zIndex: 250 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookLanding;
