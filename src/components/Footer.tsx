"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "@/components/Magnetic";
import { site } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;

/** Live clock locked to Calgary, Alberta (America/Calgary). */
function CalgaryClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    // Calgary's canonical IANA zone is America/Edmonton (same Mountain
    // Time); some ICU builds reject the "America/Calgary" alias.
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    let formatter: Intl.DateTimeFormat;
    try {
      formatter = new Intl.DateTimeFormat("en-US", {
        ...options,
        timeZone: site.timezone,
      });
    } catch {
      formatter = new Intl.DateTimeFormat("en-US", {
        ...options,
        timeZone: "America/Edmonton",
      });
    }
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {time ?? "--:--:-- --"}
    </span>
  );
}

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative z-10 flex min-h-[92svh] flex-col justify-between overflow-hidden rounded-t-[2.5rem] bg-ink px-5 pb-28 pt-24 text-paper md:px-10 md:pt-32"
    >
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease }}
        className="text-[13px] font-medium uppercase tracking-[0.14em] text-paper/50"
      >
        (04) — Contact
      </motion.p>

      <div className="py-16 md:py-24">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease }}
          className="mb-6 max-w-[420px] text-[17px] leading-relaxed text-paper/70 md:text-[19px]"
        >
          Have a product to build, a brand to sharpen, or just want to talk
          shop over coffee? My inbox is open.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, delay: 0.1, ease }}
        >
          <a
            href={`mailto:${site.email}`}
            className="text-display group inline-flex items-start gap-3 text-[15vw] font-bold uppercase transition-colors duration-500 hover:text-accent md:text-[9.5vw]"
          >
            Get in Touch
            <ArrowUpRight
              className="mt-[0.18em] h-[0.5em] w-[0.5em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:translate-x-2"
              strokeWidth={1.5}
            />
          </a>
        </motion.div>
      </div>

      <div className="border-t border-paper/15 pt-8">
        <div className="grid grid-cols-2 gap-y-10 text-[14px] font-medium md:grid-cols-4 md:text-[15px]">
          <div>
            <p className="mb-2 text-[12px] uppercase tracking-[0.14em] text-paper/40">
              Local Time
            </p>
            <p>
              <CalgaryClock />
              <span className="ml-2 text-paper/50">Calgary, AB</span>
            </p>
          </div>

          <div>
            <p className="mb-2 text-[12px] uppercase tracking-[0.14em] text-paper/40">
              Socials
            </p>
            <div className="flex flex-col items-start gap-1">
              <Magnetic strength={0.3}>
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-accent"
                >
                  LinkedIn ↗
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a
                  href={site.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-accent"
                >
                  Instagram ↗
                </a>
              </Magnetic>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="mb-2 text-[12px] uppercase tracking-[0.14em] text-paper/40">
              Email
            </p>
            <Magnetic strength={0.3}>
              <a
                href={`mailto:${site.email}`}
                className="transition-colors duration-300 hover:text-accent"
              >
                {site.email}
              </a>
            </Magnetic>
          </div>

          <div className="col-span-2 md:col-span-1 md:text-right">
            <p className="mb-2 text-[12px] uppercase tracking-[0.14em] text-paper/40">
              ©{site.year}
            </p>
            <p className="text-paper/60">
              {site.name}. Designed & built with intent.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
