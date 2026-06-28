"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

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

interface ParallaxGalleryProps {
  scrollYProgress: MotionValue<number>;
}

export const ParallaxGallery = ({ scrollYProgress }: ParallaxGalleryProps) => {
  const [height, setHeight] = useState(800);

  useEffect(() => {
    setHeight(window.innerHeight);
    const handleResize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Map parent scroll from 0.82 to 0.98 directly to column translation coordinates
  const y = useTransform(scrollYProgress, [0.82, 0.98], [height * 0.15, -height * 0.65], { clamp: true });
  const y2 = useTransform(scrollYProgress, [0.82, 0.98], [height * 0.35, -height * 0.85], { clamp: true });
  const y3 = useTransform(scrollYProgress, [0.82, 0.98], [height * 0.05, -height * 0.45], { clamp: true });
  const y4 = useTransform(scrollYProgress, [0.82, 0.98], [height * 0.25, -height * 0.75], { clamp: true });

  const galleryOpacity = useTransform(scrollYProgress, [0.80, 0.84], [0, 1]);
  const pointerEvents = useTransform(scrollYProgress, (v) => v > 0.82 ? "auto" : "none");

  return (
    <motion.div 
      style={{ opacity: galleryOpacity, pointerEvents }}
      className="absolute inset-0 w-full h-full bg-[#EFEBE0] text-black flex flex-col justify-between overflow-hidden z-20"
    >
      {/* Gallery Header */}
      <div className="relative flex h-[28vh] items-end justify-center pb-4 select-none z-30">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold text-terracotta uppercase tracking-[0.24em] font-sans">Plate V — Gallery</span>
          <h2 className="font-serif text-2xl sm:text-3xl text-forest font-bold">Campus Life & Labs</h2>
          <p className="font-serif italic text-ink/60 text-[11px] max-w-xs mx-auto leading-relaxed">
            Scroll further to travel through our student campuses.
          </p>
        </div>
      </div>

      {/* Grid container */}
      <div className="relative flex-1 flex gap-[2vw] overflow-hidden p-[2vw] h-[55vh] items-center z-10">
        <Column images={[images[0], images[1], images[2]]} y={y} />
        <Column images={[images[3], images[4], images[5]]} y={y2} />
        <Column images={[images[6], images[7], images[8]]} y={y3} />
        <Column images={[images[9], images[10], images[11]]} y={y4} />
      </div>

      {/* Gallery Footer */}
      <div className="relative flex h-[17vh] items-center justify-center select-none z-30">
        <div className="text-center">
          <span className="text-[9px] font-bold text-terracotta uppercase tracking-[0.24em] font-sans">— End of Presentation —</span>
        </div>
      </div>
    </motion.div>
  );
};

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
};

const Column = ({ images, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative flex h-[150vh] w-1/4 min-w-[100px] sm:min-w-[180px] flex-col gap-[2vw]"
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
