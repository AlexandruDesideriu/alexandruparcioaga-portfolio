"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { site } from "@/lib/site";

const HeroCanvas = dynamic(() => import("@/components/HeroCanvas"), {
  ssr: false,
});

const fade = {
  initial: { y: 28, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(true);

  // Stop the WebGL frameloop entirely once the hero is scrolled away.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="top" className="relative h-[100svh]">
      <div className="fixed inset-0 h-[100svh]">
        <HeroCanvas active={active} />
      </div>

      {/* Editorial overlays — deliberately outside the WebGL pass so they
          stay crisp while the name melts underneath them. */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-5 pb-24 pt-24 md:px-10 md:pb-8">
        <div className="flex justify-end">
          <motion.p
            {...fade}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[220px] text-right text-[13px] font-medium uppercase leading-relaxed tracking-[0.14em] text-muted"
          >
            Portfolio
            <br />
            Vol. {site.year}
          </motion.p>
        </div>

        <div className="flex items-end justify-between">
          <motion.p
            {...fade}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[300px] text-[15px] font-medium leading-snug md:text-[17px]"
          >
            {site.role},
            <br />
            based in {site.location}.
          </motion.p>
          <motion.div
            {...fade}
            transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="hidden items-center gap-2 text-[13px] font-medium uppercase tracking-[0.14em] text-muted md:flex"
          >
            Scroll
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" strokeWidth={2} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
