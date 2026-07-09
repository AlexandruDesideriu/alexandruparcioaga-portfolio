"use client";

import { motion } from "framer-motion";
import Magnetic from "@/components/Magnetic";
import { site } from "@/lib/site";

const links = [
  { label: "Capabilities", href: "#capabilities", mobile: false },
  { label: "Projects", href: "#projects", mobile: false },
  { label: "About Me", href: "#about", mobile: false },
  { label: "Get in Touch", href: "#contact", mobile: true },
];

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 mix-blend-difference"
    >
      <nav className="flex items-center justify-between px-5 py-5 text-[13px] font-medium uppercase tracking-[0.14em] text-white md:px-10">
        <Magnetic strength={0.25}>
          <a href="#top" className="whitespace-nowrap">
            <span className="hidden md:inline">{site.name}</span>
            <span className="md:hidden">AP</span>
            <span className="ml-2 hidden opacity-50 md:inline">©{site.year}</span>
          </a>
        </Magnetic>
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          {links.map((link) => (
            <Magnetic
              key={link.href}
              strength={0.3}
              className={link.mobile ? undefined : "hidden md:inline-block"}
            >
              <a
                href={link.href}
                className="group relative inline-block overflow-hidden"
              >
                <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
                  {link.label}
                </span>
                <span className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
                  {link.label}
                </span>
              </a>
            </Magnetic>
          ))}
        </div>
      </nav>
    </motion.header>
  );
}
