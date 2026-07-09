"use client";

import { motion } from "framer-motion";

const capabilities = [
  {
    index: "01",
    title: "Product",
    services: ["Design", "Management", "Delivery"],
    blurb:
      "End-to-end product thinking — from the first sketch to the shipped release, with the roadmap to match.",
  },
  {
    index: "02",
    title: "Creative",
    services: ["Branding", "Website", "Motion"],
    blurb:
      "Identities and interfaces with a point of view. Considered type, deliberate color, movement with intent.",
  },
  {
    index: "03",
    title: "Human",
    services: ["Consulting", "Strategy", "Coffee Chats"],
    blurb:
      "The unautomatable part. Honest advice, sharp strategy, and conversation that is worth the coffee.",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      className="relative z-10 bg-paper px-5 py-28 md:px-10 md:py-40"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease }}
        className="mb-16 flex items-baseline justify-between border-t border-line pt-5 md:mb-24"
      >
        <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-muted">
          (01) — Capabilities
        </p>
        <p className="hidden text-[13px] font-medium uppercase tracking-[0.14em] text-muted md:block">
          What I do best
        </p>
      </motion.div>

      <div>
        {capabilities.map((cap, i) => (
          <motion.article
            key={cap.index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: i * 0.08, ease }}
            className="group relative border-t border-line last:border-b"
          >
            {/* Ink fill that sweeps in on hover */}
            <div className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />

            <div className="relative grid grid-cols-12 items-baseline gap-y-6 py-10 transition-colors duration-500 group-hover:text-paper md:py-14">
              <span className="col-span-2 text-[13px] font-medium tracking-[0.14em] text-muted transition-colors duration-500 group-hover:text-paper/60 md:col-span-1">
                ({cap.index})
              </span>

              <h3 className="text-display col-span-10 text-[13vw] font-bold uppercase md:col-span-5 md:text-[5.2vw]">
                {cap.title}
              </h3>

              <ul className="col-span-6 col-start-3 flex flex-col gap-1 text-[15px] font-medium md:col-span-3 md:col-start-7 md:text-[17px]">
                {cap.services.map((service) => (
                  <li key={service} className="flex items-center gap-2">
                    <span className="inline-block h-1 w-1 rounded-full bg-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    {service}
                  </li>
                ))}
              </ul>

              <p className="col-span-10 col-start-3 max-w-[340px] text-[14px] leading-relaxed text-muted transition-colors duration-500 group-hover:text-paper/70 md:col-span-3 md:col-start-10 md:text-[15px]">
                {cap.blurb}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
