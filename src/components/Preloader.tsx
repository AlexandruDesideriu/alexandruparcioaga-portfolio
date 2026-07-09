"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { site } from "@/lib/site";

const EXPO = [0.76, 0, 0.24, 1] as const;

/** Organic border-radius keyframes — the blob breathes between these. */
const BLOB_SHAPES = [
  "58% 42% 55% 45% / 44% 58% 42% 56%",
  "45% 55% 48% 52% / 58% 44% 56% 42%",
  "52% 48% 62% 38% / 46% 54% 42% 58%",
  "58% 42% 55% 45% / 44% 58% 42% 56%",
];

const RING_TEXT = "PRODUCT ● CREATIVE ● HUMAN ● PRODUCT ● CREATIVE ● HUMAN ● ";

type Phase = "loading" | "swallow" | "iris" | "done";

/**
 * "The Drop" — a morphing ultramarine blob (kin to the hero's liquid
 * shader) trailed by chromatic ghosts, orbited by the three pillars on
 * a rotating ring. At 100% it swallows the viewport, then an iris wipe
 * with an ink ring chasing the accent edge reveals the page.
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [swallowScale, setSwallowScale] = useState(14);
  const fontsReady = useRef(false);
  const blobRef = useRef<HTMLDivElement>(null);

  // Iris wipe: two radial masks — accent hole leads, ink hole chases.
  const accentR = useMotionValue(0);
  const inkR = useMotionValue(0);
  const accentMask = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent ${accentR}px, #000 calc(${accentR}px + 1px))`;
  const inkMask = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent ${inkR}px, #000 calc(${inkR}px + 1px))`;

  // Lock scrolling while the loader owns the screen.
  useEffect(() => {
    if (phase === "done") return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      html.style.overflow = previous;
    };
  }, [phase]);

  // Organic counter climb; holds at 99 until fonts land.
  useEffect(() => {
    document.fonts.ready
      .then(() => {
        fontsReady.current = true;
      })
      .catch(() => {
        fontsReady.current = true;
      });

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return p;
        const step = 1.3 + Math.random() * 2.7;
        return Math.min(p + step, fontsReady.current ? 100 : 99);
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // 100% → swallow: size the scale so the blob covers the viewport.
  useEffect(() => {
    if (phase !== "loading" || progress < 100) return;
    const timeout = setTimeout(() => {
      const diameter = blobRef.current?.offsetWidth ?? 220;
      setSwallowScale(
        (Math.hypot(window.innerWidth, window.innerHeight) / diameter) * 1.25
      );
      setPhase("swallow");
    }, 300);
    return () => clearTimeout(timeout);
  }, [progress, phase]);

  // Swallow → iris on a fixed clock (matches the scale transition), so
  // the handoff never depends on framer completing a mixed animation
  // that also contains an infinite border-radius loop.
  useEffect(() => {
    if (phase !== "swallow") return;
    const timeout = setTimeout(() => setPhase("iris"), 950);
    return () => clearTimeout(timeout);
  }, [phase]);

  // Iris wipe, then hand the page over.
  useEffect(() => {
    if (phase !== "iris") return;
    const maxR = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 80;
    const lead = animate(accentR, maxR, { duration: 0.8, ease: EXPO });
    const chase = animate(inkR, maxR, {
      duration: 0.8,
      ease: EXPO,
      delay: 0.16,
      onComplete: () => setPhase("done"),
    });
    return () => {
      lead.stop();
      chase.stop();
    };
  }, [phase, accentR, inkR]);

  if (phase === "done") return null;

  const swallowing = phase === "swallow";
  const counter = String(Math.floor(progress)).padStart(3, "0");

  return (
    <div className="fixed inset-0 z-[200]" aria-hidden>
      {phase !== "iris" ? (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-paper">
          {/* Corner captions */}
          <motion.p
            animate={{ opacity: swallowing ? 0 : 1 }}
            transition={{ duration: 0.25 }}
            className="absolute left-5 top-5 text-[13px] font-medium uppercase tracking-[0.14em] text-muted md:left-10"
          >
            {site.name} ©{site.year}
          </motion.p>
          <motion.p
            animate={{ opacity: swallowing ? 0 : 1 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-6 left-5 text-[13px] font-medium uppercase tracking-[0.14em] text-muted md:left-10"
          >
            Portfolio — Vol. {site.year}
          </motion.p>

          {/* Chromatic ghosts — the RGB split, foreshadowed. They morph
              with the blob and lag behind it during the swallow. */}
          <motion.div
            animate={{
              borderRadius: BLOB_SHAPES,
              scale: swallowing ? swallowScale : 1,
              x: swallowing ? 0 : -10,
            }}
            transition={{
              borderRadius: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 0.85, ease: EXPO, delay: 0.1 },
              x: { duration: 0.3 },
            }}
            className="absolute h-56 w-56 bg-[#ff2d2d] opacity-45 mix-blend-multiply"
          />
          <motion.div
            animate={{
              borderRadius: BLOB_SHAPES,
              scale: swallowing ? swallowScale : 1,
              x: swallowing ? 0 : 10,
            }}
            transition={{
              borderRadius: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: -3.5 },
              scale: { duration: 0.85, ease: EXPO, delay: 0.05 },
              x: { duration: 0.3 },
            }}
            className="absolute h-56 w-56 bg-[#19c8ff] opacity-45 mix-blend-multiply"
          />

          {/* The Drop */}
          <motion.div
            ref={blobRef}
            animate={{
              borderRadius: BLOB_SHAPES,
              scale: swallowing ? swallowScale : 0.82 + (progress / 100) * 0.18,
            }}
            transition={{
              borderRadius: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              scale: swallowing
                ? { duration: 0.85, ease: EXPO }
                : { duration: 0.4, ease: "easeOut" },
            }}
            className="absolute h-56 w-56 bg-accent"
          />

          {/* Counter, riding the blob */}
          <motion.p
            animate={{ opacity: swallowing ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="absolute text-4xl font-semibold tabular-nums tracking-tight text-paper"
          >
            {counter}
          </motion.p>

          {/* Orbiting pillars */}
          <motion.div
            animate={swallowing ? { opacity: 0 } : { rotate: 360 }}
            transition={
              swallowing
                ? { duration: 0.25 }
                : { rotate: { duration: 14, repeat: Infinity, ease: "linear" } }
            }
            className="absolute h-[340px] w-[340px]"
          >
            <svg viewBox="0 0 340 340" className="h-full w-full">
              <defs>
                <path
                  id="pillars-orbit"
                  d="M170,170 m-150,0 a150,150 0 1,1 300,0 a150,150 0 1,1 -300,0"
                />
              </defs>
              <text className="fill-ink font-sans text-[13px] font-semibold uppercase" letterSpacing="3.5">
                <textPath href="#pillars-orbit" textLength="938" lengthAdjust="spacingAndGlyphs">
                  {RING_TEXT}
                </textPath>
              </text>
            </svg>
          </motion.div>
        </div>
      ) : (
        <>
          {/* Iris reveal: ink ring chases the accent edge outward. */}
          <motion.div
            className="absolute inset-0 bg-ink"
            style={{ maskImage: inkMask, WebkitMaskImage: inkMask }}
          />
          <motion.div
            className="absolute inset-0 bg-accent"
            style={{ maskImage: accentMask, WebkitMaskImage: accentMask }}
          />
        </>
      )}
    </div>
  );
}
