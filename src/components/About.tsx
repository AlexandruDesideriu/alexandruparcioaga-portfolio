"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;

const paragraphs = [
  "I'm drawn to how people gather — the traditions, tables, and rituals that carry culture forward. That's the oldest design system there is, and I try to build with the same care.",
  "Calgary keeps me close to the mountains. Time outside — cold air, long trails, big skies — is where problems untangle themselves.",
  "I move between art and technology without treating them as opposites. Galleries and codebases feed the same curiosity, and the best work happens where they overlap.",
  "And people, always. A good conversation over coffee beats a perfect brief — that's not a line, it's on my services list.",
];

const index = [
  { label: "Base", value: ["Calgary, Alberta, Canada"] },
  { label: "Practice", value: ["Product · Creative · Human"] },
  {
    label: "Interests",
    value: ["People & culture", "The outdoors", "Art", "Technology"],
  },
  { label: "Status", value: ["Open to new projects"], live: true },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative z-10 bg-paper px-5 pb-28 md:px-10 md:pb-40"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease }}
        className="mb-16 flex items-baseline justify-between border-t border-line pt-5 md:mb-24"
      >
        <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-muted">
          (03) — About Me
        </p>
        <p className="hidden text-[13px] font-medium uppercase tracking-[0.14em] text-muted md:block">
          The human part
        </p>
      </motion.div>

      <div className="grid grid-cols-12 gap-x-6 gap-y-14">
        {/* Statement + story */}
        <div className="col-span-12 md:col-span-7">
          <motion.h3
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease }}
            className="text-display mb-10 max-w-[16ch] text-[8.5vw] font-bold uppercase md:text-[3.6vw]"
          >
            The human in my work isn&apos;t a pillar
            <span className="text-accent">.</span> It&apos;s the point
            <span className="text-accent">.</span>
          </motion.h3>

          <div className="max-w-[560px] space-y-5">
            {paragraphs.map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, delay: i * 0.06, ease }}
                className="text-[16px] leading-relaxed text-ink/80 md:text-[17px]"
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Index */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="col-span-12 md:col-span-4 md:col-start-9"
        >
          <div className="border-t border-line">
            {index.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-2 gap-4 border-b border-line py-5"
              >
                <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-muted">
                  {row.label}
                </p>
                <div className="flex flex-col gap-1 text-[15px] font-medium">
                  {row.value.map((v) => (
                    <p key={v} className="flex items-center gap-2">
                      {row.live && (
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                        </span>
                      )}
                      {v}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[14px] leading-relaxed text-muted">
            Say hello — the kettle is probably already on.{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-ink underline underline-offset-4 transition-colors duration-300 hover:text-accent"
            >
              {site.email}
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
