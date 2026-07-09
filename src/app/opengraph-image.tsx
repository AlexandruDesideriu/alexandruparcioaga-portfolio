import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#f4f2ec";
const INK = "#111110";
const ACCENT = "#2621eb";
const MUTED = "#75726a";

/** Branded share card: the hero's typography, rendered at build time. */
export default async function OpengraphImage() {
  const familjen = await readFile(
    path.join(process.cwd(), "public/fonts/FamiljenGrotesk-700.ttf")
  );

  const caption: React.CSSProperties = {
    fontSize: 22,
    letterSpacing: 3,
    color: MUTED,
  };

  const dot = (
    <div
      style={{
        width: 14,
        height: 14,
        borderRadius: 9999,
        backgroundColor: ACCENT,
      }}
    />
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: PAPER,
          padding: "56px 64px",
          fontFamily: "Familjen Grotesk",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={caption}>{`${site.name.toUpperCase()} ©${site.year}`}</div>
          <div style={caption}>{`PORTFOLIO — VOL. ${site.year}`}</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 158,
            lineHeight: 0.92,
            color: INK,
          }}
        >
          <div style={{ display: "flex" }}>{site.firstName}</div>
          <div style={{ display: "flex" }}>
            PARCI<span style={{ color: ACCENT }}>O</span>AGA
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ ...caption, color: INK }}>PRODUCT</div>
            {dot}
            <div style={{ ...caption, color: INK }}>CREATIVE</div>
            {dot}
            <div style={{ ...caption, color: INK }}>HUMAN</div>
          </div>
          <div style={caption}>CALGARY, AB</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Familjen Grotesk",
          data: familjen,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
