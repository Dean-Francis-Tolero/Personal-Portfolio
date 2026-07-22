"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react";
import type { Project } from "../lib/resume_data";
import { useScrollContainer } from "./scroll_container";

// Front-loads the odd project into row one so a short list still reads as two
// intentional rows instead of one full row and one mostly-empty one.
function splitIntoRows(projects: Project[]): [Project[], Project[]] {
  const mid = Math.ceil(projects.length / 2);
  return [projects.slice(0, mid), projects.slice(mid)];
}

export function ProjectParallax({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollContainer = useScrollContainer();
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainer ?? undefined,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30 };

  // Kept small on purpose: with only a handful of cards (vs. the template's 5-wide rows),
  // a large drift shoves the whole row off-screen well before the scroll section ends.
  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 120]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -120]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-500, 300]), springConfig);

  const [firstRow, secondRow] = splitIntoRows(projects);

  return (
    <div
      ref={ref}
      className="relative flex h-[150vh] flex-col self-auto pt-24 pb-32 [perspective:1000px] [transform-style:preserve-3d]"
    >
      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        <motion.div className="mb-16 flex flex-row-reverse justify-center gap-10 px-10">
          {firstRow.map((project) => (
            <ProjectCard key={project.id} project={project} translate={translateX} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row justify-center gap-10 px-10">
          {secondRow.map((project) => (
            <ProjectCard key={project.id} project={project} translate={translateXReverse} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function ProjectCard({ project, translate }: { project: Project; translate: MotionValue<number> }) {
  const media = (
    <div className="relative h-72 w-full overflow-hidden">
      {project.image ? (
        <img
          src={project.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 h-full w-full bg-muted/25" />
      )}
      <div className="absolute inset-0 h-full w-full bg-foreground opacity-0 transition-opacity duration-300 group-hover/card:opacity-80" />
      {project.link && (
        <span className="absolute bottom-4 left-4 text-sm font-semibold text-background opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
          View project ↗
        </span>
      )}
    </div>
  );

  const caption = (
    <div className="mt-3">
      <h3 className="text-lg font-bold">{project.name}</h3>
      {project.tech && <p className="mt-1 text-xs text-muted">{project.tech.join(" · ")}</p>}
    </div>
  );

  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -12 }}
      className="group/card w-[26rem] shrink-0"
    >
      {project.link ? (
        <a href={project.link} target="_blank" rel="noreferrer" className="block">
          {media}
          {caption}
        </a>
      ) : (
        <div>
          {media}
          {caption}
        </div>
      )}
    </motion.div>
  );
}
