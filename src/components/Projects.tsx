"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import omenieBanner from "@/images/omenie.jpg";
import fohnBanner from "@/images/fohn.jpg";

const ease = [0.16, 1, 0.3, 1] as const;

type Project = {
  index: string;
  title: string;
  category: string;
  year: string;
  href: string;
  aspect: string;
  sizes: string;
  image: StaticImageData;
};

const projects: Project[] = [
  {
    index: "01",
    title: "Omenie Studios",
    category: "Brand, Digital & Motion — Creative Studio",
    year: "2026",
    href: "https://omenie-studios.vercel.app/",
    aspect: "aspect-[4/3]",
    sizes: "(min-width: 768px) 56vw, 100vw",
    image: omenieBanner,
  },
  {
    index: "02",
    title: "FÖHN",
    category: "Brand System & Web — Design Studio",
    year: "2026",
    href: "https://foehn-lyart.vercel.app/",
    aspect: "aspect-[4/5]",
    sizes: "(min-width: 768px) 40vw, 100vw",
    image: fohnBanner,
  },
];

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
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

export default function Projects() {
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
        className="mb-16 flex items-baseline justify-between border-t border-line pt-5 md:mb-24"
      >
        <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-muted">
          (02) — Selected Projects
        </p>
        <p className="hidden text-[13px] font-medium uppercase tracking-[0.14em] text-muted md:block">
          Shipped & live
        </p>
      </motion.div>

      <div className="grid grid-cols-12 gap-x-6 gap-y-16">
        <div className="col-span-12 md:col-span-7">
          <ProjectCard project={projects[0]} delay={0} />
        </div>
        <div className="col-span-12 md:col-span-5 md:mt-28">
          <ProjectCard project={projects[1]} delay={0.1} />
        </div>
      </div>
    </section>
  );
}
