"use client";

import { motion } from "motion/react";
import type { Mood } from "@/lib/mood";

/** Layered, blurred blobs drifting on looping paths — speed and spread follow the mood's energy. */
export function Aurora({ mood }: { mood: Mood }) {
  const duration = 26 - mood.energy * 18; // calm = slow, intense = fast
  const blobs = [...mood.colors, ...mood.colors].slice(0, 6);

  return (
    <motion.div
      className="aurora"
      animate={{ backgroundColor: mood.background }}
      transition={{ duration: 2.5, ease: "easeInOut" }}
    >
      {blobs.map((color, i) => {
        const x = (i * 37) % 100;
        const y = (i * 53) % 100;
        return (
          <motion.span
            key={i}
            className="blob"
            initial={false}
            animate={{
              backgroundColor: color,
              left: [`${x - 15}%`, `${(x + 30) % 100 - 10}%`, `${x - 15}%`],
              top: [`${y - 20}%`, `${(y + 40) % 100 - 25}%`, `${y - 20}%`],
              scale: [1, 1.3 + mood.energy * 0.5, 1],
              rotate: [0, i % 2 ? 90 : -90, 0],
            }}
            transition={{
              backgroundColor: { duration: 2.5 },
              default: { duration: duration + i * 2, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        );
      })}
      <div className="grain" />
    </motion.div>
  );
}
