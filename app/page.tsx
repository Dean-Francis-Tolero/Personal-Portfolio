"use client";

import { useMemo } from "react";
import { motion, type Variants } from "motion/react";
import { useCurtainEntranceVariants } from "../lib/curtain_entrance";

export default function Home() {
  const { container, fadeRise, reduceMotion } = useCurtainEntranceVariants();

  const wipeReveal: Variants = useMemo(
    () => ({
      initial: reduceMotion ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" },
      animate: {
        clipPath: "inset(0 0% 0 0)",
        transition: reduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.83, 0, 0.17, 1] },
      },
    }),
    [reduceMotion]
  );

  return (
    <motion.main
      variants={container}
      initial="initial"
      animate="animate"
      className="pt-30 min-h-dvh md:h-dvh overflow-y-auto md:overflow-hidden relative flex flex-col"
    >
      <div className="flex-[1.25] flex flex-col pt-30 px-10">
        <div className="w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={fadeRise} className="flex flex-col text-4xl font-bold">Digital Playground, Personal Portfolio, Design</motion.div>
          <motion.div variants={fadeRise} className="flex flex-col text-2xl text-justify font-medium">I believe in documenting the journey, the ideas, the lessons, and the things we create along the way. This website is not only a portfolio of my work, but also a creative outlet where I explore new ideas, experiment with design, and bring concepts to life.</motion.div>
        </div>

        <div className="flex-1 flex items-end px-6 md:px-4">
          <motion.h1 variants={wipeReveal} className="text-[80px] sm:text-[120px] md:text-[160px] lg:text-[200px] font-bold leading-none">SONDER</motion.h1>
        </div>
      </div>

      <div className="flex-[0.75] bg-foreground py-6 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] flex flex-col justify-between gap-6">

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-background/20">
          <motion.div variants={fadeRise} className="py-4 md:py-0 md:pr-6">
            <p className="text-xs uppercase tracking-widest text-background/50 mb-2">Definition</p>
            <p className="text-sm leading-relaxed text-background/90">The realization that each random passerby is living a life as vivid and complex as your own. Filled with their own experiences, thoughts, and emotions, most of which you will never know.</p>
          </motion.div>
          <motion.div variants={fadeRise} className="py-4 md:py-0 md:px-6">
            <p className="text-xs uppercase tracking-widest text-background/50 mb-2">Origin</p>
            <p className="text-sm leading-relaxed text-background/90">Coined by John Koenig for The Dictionary of Obscure Sorrows (2012), from the French sonder, &ldquo;to probe.&rdquo;</p>
          </motion.div>
          <motion.div variants={fadeRise} className="py-4 md:py-0 md:pl-6">
            <p className="text-xs uppercase tracking-widest text-background/50 mb-2">Cultural Impact</p>
            <p className="text-sm leading-relaxed text-background/90">Spread widely online as shorthand for empathy toward strangers, never in a dictionary; yet universally understood.</p>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
};