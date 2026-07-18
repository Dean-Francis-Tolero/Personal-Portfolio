"use client";

import { motion, type Variants, useReducedMotion } from "motion/react";
import { projects } from "../../lib/resume_data";
import { ProjectParallax } from "../../components/project_parallax";

export default function ProjectsPage() {
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

  return (
    <main>
      <motion.div
        variants={container}
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto w-full px-10 pt-40 md:pt-52"
      >
        <motion.h1 variants={fadeRise} className="text-4xl md:text-6xl font-bold">
          Projects
        </motion.h1>
        <motion.p variants={fadeRise} className="mt-6 max-w-xl text-lg md:text-xl font-medium text-muted">
          A selection of things I&apos;ve built — scroll to see them.
        </motion.p>
      </motion.div>

      <ProjectParallax projects={projects} />
    </main>
  );
}
