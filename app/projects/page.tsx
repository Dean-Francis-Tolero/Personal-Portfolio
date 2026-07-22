"use client";

import { motion } from "motion/react";
import { projects } from "../../lib/resume_data";
import { ProjectParallax } from "../../components/project_parallax";
import { useCurtainEntranceVariants } from "../../lib/curtain_entrance";

export default function ProjectsPage() {
  const { container, fadeRise } = useCurtainEntranceVariants();

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
          A collection of projects exploring software engineering ideas.
        </motion.p>
      </motion.div>

      <ProjectParallax projects={projects} />
    </main>
  );
}
