"use client";

import { motion } from "framer-motion";
import Magnetic from "@/components/Magnetic";
import { aiSummaryLinks } from "@/lib/site";

/**
 * Persistent floating dock: hand this portfolio to an AI of the
 * visitor's choice with a pre-canned recruiter prompt.
 */
export default function AISummary() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-paper/10 bg-ink/90 p-1.5 pl-4 text-paper shadow-2xl shadow-ink/30 backdrop-blur-md"
      >
        <span className="mr-2 hidden items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-paper/60 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Summarize with
        </span>
        {aiSummaryLinks.map((link) => (
          <Magnetic key={link.label} strength={0.25}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors duration-300 hover:bg-paper hover:text-ink"
            >
              {link.label}
            </a>
          </Magnetic>
        ))}
      </motion.div>
    </div>
  );
}
