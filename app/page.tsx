"use client";

import { motion, type Variants, useReducedMotion } from "motion/react";

export default function Home() {
  const reduceMotion = useReducedMotion();

  const container: Variants = {
    initial: {},
    animate: {
      transition: reduceMotion ? {} : { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const fadeRise: Variants = {
    initial: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    animate: {
      opacity: 1,
      y: 0,
      transition: reduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const wipeReveal: Variants = {
    initial: reduceMotion ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" },
    animate: {
      clipPath: "inset(0 0% 0 0)",
      transition: reduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.83, 0, 0.17, 1] },
    },
  };

  return (
    <motion.main
      variants={container}
      initial="initial"
      animate="animate"
      className="pt-30 min-h-dvh md:h-dvh overflow-y-auto md:overflow-hidden relative flex flex-col"
    >
      <div className="flex-1 flex flex-col justify-center pt-30 px-10 pb-10">
        <div className="w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={fadeRise} className="flex flex-col text-4xl font-bold">Digital Playground, Personal Portfolio, Design</motion.div>
          <motion.div variants={fadeRise} className="flex flex-col text-2xl text-justify font-medium">I believe in documenting the journey, the ideas, the lessons, and the things we create along the way. This website is not only a portfolio of my work, but also a creative outlet where I explore new ideas, experiment with design, and bring concepts to life.</motion.div>
        </div>

        <div className="p-6 md:p-4">
          <motion.h1 variants={wipeReveal} className="text-[80px] sm:text-[120px] md:text-[160px] lg:text-[200px] font-bold">Concept</motion.h1>
        </div>
      </div>

      <div className="flex-1 bg-foreground py-10 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.06)]">
        <motion.p variants={fadeRise} className="text-[40px] text-right font-semibold pt-5 pr-10 text-background">Dean Francis Tolero</motion.p>
      </div>
    </motion.main>
  );
};