"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";

/**
 * Custom cursor: a solid ink dot that tracks the pointer 1:1 and a
 * trailing ring on a spring. The ring inflates over interactive
 * elements. Rendered only for precise pointers.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 400, damping: 35, mass: 0.6 });
  const ringY = useSpring(dotY, { stiffness: 400, damping: 35, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const onMove = (event: PointerEvent) => {
      dotX.set(event.clientX);
      dotY.set(event.clientY);
      setVisible(true);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      setHovering(
        Boolean(target?.closest?.("a, button, [data-cursor-hover]"))
      );
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
    };
  }, [dotX, dotY]);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[90] mix-blend-difference transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    >
      <CursorDot x={dotX} y={dotY} hovering={hovering} />
      <CursorRing x={ringX} y={ringY} hovering={hovering} />
    </div>
  );
}

function CursorDot({
  x,
  y,
  hovering,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  hovering: boolean;
}) {
  return (
    <motion.div
      className="absolute h-2 w-2 rounded-full bg-white"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      animate={{ scale: hovering ? 0.4 : 1 }}
      transition={{ duration: 0.25 }}
    />
  );
}

function CursorRing({
  x,
  y,
  hovering,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  hovering: boolean;
}) {
  return (
    <motion.div
      className="absolute h-9 w-9 rounded-full border border-white/70"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      animate={{ scale: hovering ? 1.7 : 1, opacity: hovering ? 1 : 0.55 }}
      transition={{ duration: 0.3 }}
    />
  );
}
