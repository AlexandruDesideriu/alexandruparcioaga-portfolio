"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import omenieBanner from "@/images/omenie.jpg";
import fohnBanner from "@/images/fohn.jpg";

const ease = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Case index — client engagements delivered under NDA                  */
/* ------------------------------------------------------------------ */

type CaseStudy = {
  index: string;
  codeName: string;
  pillar: string;
  headline: string;
  summary: string;
  focus: string[];
};

const caseStudies: CaseStudy[] = [
  {
    index: "C.01",
    codeName: "GENOME.CORE",
    pillar: "Product // Creative",
    headline: "Environmental Restoration & Genomic Analytics Architecture",
    summary:
      "Product direction and cross-functional design leadership for a supercluster research initiative: a mobile biosample collection app paired with a web-based genomic analytics platform. Complex bioinformatic pipelines resolve taxonomy and chemistry signals into decision-ready views, powering nature-restoration research across industrial impact sites.",
    focus: [
      "Multi-stakeholder orchestration",
      "Cross-platform UI/UX",
      "Environmental tech",
    ],
  },
  {
    index: "C.02",
    codeName: "FLUX.ETL",
    pillar: "Product",
    headline: "Enterprise Ingestion & Transformation Matrix",
    summary:
      "Directed sourcing, mapping, and automated document-parsing pipelines that convert complex, unstructured source files into normalized, digest-ready payloads for third-party enterprise platforms. Operated across the stack as data analyst, BI strategist, and product owner to remove manual ingestion bottlenecks entirely.",
    focus: [
      "Pipeline architecture",
      "Automated PDF parsing",
      "ETL data mapping",
      "Quality assurance",
    ],
  },
  {
    index: "C.03",
    codeName: "VANGUARD",
    pillar: "Product // Strategy",
    headline: "Technology Optimization & Organizational Realignment",
    summary:
      "Technology advisor to executive and director-level leadership at a major tourism, agriculture, and live-events enterprise. Audited legacy, siloed operations and engineered a complete modernization roadmap, from ideation through procurement, to drive standardization across the organization.",
    focus: [
      "Executive advisory",
      "Technology procurement",
      "Legacy de-siloing",
      "Digital strategy",
    ],
  },
  {
    index: "C.04",
    codeName: "TERRA.RAG",
    pillar: "Product // Creative",
    headline: "LLM-Powered Land & Environmental Remediation Analytics",
    summary:
      "Product owner for a retrieval-augmented generation proof of concept: natural-language querying over environmental land data to analyze and predict site conditions. Partnered with AI/ML technical leads to prove LLM-driven retrieval viable for high-stakes environmental decision-making.",
    focus: [
      "RAG / LLM product ownership",
      "Geospatial intelligence",
      "Natural-language querying",
    ],
  },
  {
    index: "C.05",
    codeName: "AEGIS",
    pillar: "Human // Creative",
    headline: "Dual-Ecosystem Trainer Portal & Crisis Intervention App",
    summary:
      "Program management, product ownership, and end-to-end design for a greenfield mental-health ecosystem: a synchronized web portal for certified-instructor management beside a human-centric mobile app delivering real-time intervention resources, safety networks, and community support to people in crisis.",
    focus: [
      "Human-centric UI/UX",
      "Community safety systems",
      "Dual web/mobile ecosystem",
    ],
  },
  {
    index: "C.06",
    codeName: "SEDIMENT.AI",
    pillar: "Product // Creative",
    headline: "Bluefield Asset Modernization & Conversational Data Architecture",
    summary:
      "Modernization of a high-volume analytics platform covering energy assets across Western Canada. Re-engineered legacy workflows into intuitive visual summaries and initiated an agentic LLM layer that lets analysts talk to the data, automating complex in-app analysis through natural-language prompts.",
    focus: [
      "Bluefield modernization",
      "Interactive visual analytics",
      "Agentic AI integration",
    ],
  },
];

function CaseRow({
  study,
  open,
  onToggle,
}: {
  study: CaseStudy;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease }}
      className="border-b border-line"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        data-cursor-hover
        className="group grid w-full grid-cols-12 items-baseline gap-x-4 py-7 text-left md:py-8"
      >
        <span className="col-span-3 text-[13px] font-medium tracking-[0.14em] text-muted md:col-span-1">
          ({study.index})
        </span>

        <span className="col-span-9 md:col-span-7">
          <span className="block text-[20px] font-semibold tracking-tight transition-colors duration-300 group-hover:text-accent md:text-[26px]">
            {study.codeName}
          </span>
          <span className="mt-1 block text-[12px] font-medium uppercase tracking-[0.14em] text-muted md:text-[13px]">
            {study.headline}
          </span>
        </span>

        <span className="col-span-9 col-start-4 mt-3 text-[12px] font-medium uppercase tracking-[0.14em] text-muted md:col-span-3 md:col-start-9 md:mt-0 md:text-right">
          {study.pillar}
        </span>

        <span className="col-span-1 hidden justify-end md:flex">
          <Plus
            className={cn(
              "h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              open && "rotate-45"
            )}
            strokeWidth={1.5}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-12 gap-x-4 gap-y-6 pb-9 md:pb-10">
              <p className="col-span-12 max-w-[620px] text-[15px] leading-relaxed text-ink/80 md:col-span-7 md:col-start-2 md:text-[16px]">
                {study.summary}
              </p>
              <div className="col-span-12 flex flex-wrap content-start items-start gap-2 md:col-span-3 md:col-start-10">
                {study.focus.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-line px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Live builds — public, visitable work                                 */
/* ------------------------------------------------------------------ */

type LiveProject = {
  index: string;
  title: string;
  category: string;
  year: string;
  href: string;
  aspect: string;
  sizes: string;
  image: StaticImageData;
};

const liveProjects: LiveProject[] = [
  {
    index: "L.01",
    title: "Omenie Studios",
    category: "Brand, Digital & Motion — Creative Studio",
    year: "2026",
    href: "https://omenie-studios.vercel.app/",
    aspect: "aspect-[4/3]",
    sizes: "(min-width: 768px) 56vw, 100vw",
    image: omenieBanner,
  },
  {
    index: "L.02",
    title: "FÖHN",
    category: "Brand System & Web — Design Studio",
    year: "2026",
    href: "https://foehn-lyart.vercel.app/",
    aspect: "aspect-[4/5]",
    sizes: "(min-width: 768px) 40vw, 100vw",
    image: fohnBanner,
  },
];

function ProjectCard({
  project,
  delay,
}: {
  project: LiveProject;
  delay: number;
}) {
  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease }}
      className="group block"
    >
      <div className={cn("relative overflow-hidden rounded-2xl", project.aspect)}>
        <div className="relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]">
          <Image
            src={project.image}
            alt={`${project.title} — live website`}
            fill
            placeholder="blur"
            sizes={project.sizes}
            className="object-cover"
          />
        </div>
        <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5 text-ink" strokeWidth={1.5} />
        </div>
      </div>

      <div className="flex items-baseline justify-between border-b border-line py-4">
        <div className="flex items-baseline gap-4">
          <span className="text-[13px] font-medium tracking-[0.14em] text-muted">
            ({project.index})
          </span>
          <h3 className="text-[22px] font-semibold tracking-tight md:text-[26px]">
            {project.title}
          </h3>
        </div>
        <div className="flex items-baseline gap-6 text-[13px] font-medium uppercase tracking-[0.14em] text-muted">
          <span className="hidden lg:inline">{project.category}</span>
          <span>{project.year}</span>
        </div>
      </div>
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

function SubLabel({ left, right }: { left: string; right: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease }}
      className="mb-2 flex items-baseline justify-between border-b border-ink/40 pb-4"
    >
      <p className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.14em]">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {left}
      </p>
      <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted">
        {right}
      </p>
    </motion.div>
  );
}

export default function Projects() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="projects"
      className="relative z-10 bg-paper px-5 pb-28 md:px-10 md:pb-40"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease }}
        className="mb-16 flex items-baseline justify-between border-t border-line pt-5 md:mb-20"
      >
        <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-muted">
          (02) — Selected Projects
        </p>
        <p className="hidden text-[13px] font-medium uppercase tracking-[0.14em] text-muted md:block">
          Engagements & live builds
        </p>
      </motion.div>

      {/* Case index: confidential client engagements */}
      <div className="mb-20 md:mb-28">
        <SubLabel
          left="Case Index — Client Engagements"
          right="Under NDA · Details abstracted"
        />
        <div>
          {caseStudies.map((study, i) => (
            <CaseRow
              key={study.index}
              study={study}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>

      {/* Live builds: public, visitable work */}
      <div>
        <SubLabel left="Live Builds" right="Public · Visit them" />
        <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-16">
          <div className="col-span-12 md:col-span-7">
            <ProjectCard project={liveProjects[0]} delay={0} />
          </div>
          <div className="col-span-12 md:col-span-5 md:mt-28">
            <ProjectCard project={liveProjects[1]} delay={0.1} />
          </div>
        </div>
      </div>
    </section>
  );
}
