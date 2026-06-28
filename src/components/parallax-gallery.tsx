"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

const images = [
  "/school.png",
  "/junior_college.png",
  "/degree_college.png",
  "/technical_institute.png",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop&q=80",
];

export const ParallaxGallery = () => {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 2.0]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 0.8]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 1.6]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    requestAnimationFrame(raf);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="w-full bg-[#EFEBE0] text-black">
      <div className="relative flex h-[35vh] items-center justify-center select-none">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold text-terracotta uppercase tracking-[0.24em] font-sans">Plate V — Gallery</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-forest font-bold">Campus Life & Labs</h2>
          <p className="font-serif italic text-ink/60 text-xs max-w-xs mx-auto leading-relaxed">
            Scroll down to view our dynamic campus environments.
          </p>
        </div>
      </div>

      <div
        ref={gallery}
        className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden bg-[#EFEBE0] p-[2vw]"
      >
        <Column images={[images[0], images[1], images[2]]} y={y} />
        <Column images={[images[3], images[4], images[5]]} y={y2} />
        <Column images={[images[6], images[7], images[8]]} y={y3} />
        <Column images={[images[9], images[10], images[11]]} y={y4} />
      </div>

      <div className="relative flex h-[35vh] items-center justify-center select-none">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold text-terracotta uppercase tracking-[0.24em] font-sans">— End of Gallery —</span>
          <p className="font-serif italic text-ink/50 text-xs">Scroll up to return to the brochure.</p>
        </div>
      </div>
    </main>
  );
};

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
};

const Column = ({ images, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[150px] sm:min-w-[220px] flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative h-1/3 w-full overflow-hidden rounded-xl border border-ink/5 shadow-md bg-white">
          <img
            src={`${src}`}
            alt="Campus space"
            className="pointer-events-none object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      ))}
    </motion.div>
  );
};
