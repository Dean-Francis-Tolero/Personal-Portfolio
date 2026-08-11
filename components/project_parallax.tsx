"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useReducedMotion, type MotionValue } from "motion/react";
import type { Project } from "../lib/resume_data";
import { useScrollContainer } from "./scroll_container";

// Front-loads the odd project into row one so a short list still reads as two
// intentional rows instead of one full row and one mostly-empty one.
function splitIntoRows(projects: Project[]): [Project[], Project[]] {
  const mid = Math.ceil(projects.length / 2);
  return [projects.slice(0, mid), projects.slice(mid)];
}

// The desktop 3D scroll-tilt grid (`ProjectGrid` below) is a fixed-width,
// side-by-side, `[transform-style:preserve-3d]` layout with no responsive
// handling at all — two `flex-row` rows of `w-[30rem]` (480px) cards plus a
// scroll-linked rotateX/rotateZ/translateY/translateX drift. On a phone
// viewport that's cards wider than the screen, rotated and overlapping.
// Rather than retrofit responsiveness onto a transform-heavy scroll
// animation, mobile gets a genuinely different structure: a plain vertical
// stack, one full-width card per row, no 3D/scroll-linked motion — both
// trees render (Framer Motion hooks can't be called conditionally) and
// Tailwind's `md:hidden`/`hidden md:block` pair picks the visible one.
export function ProjectParallax({ projects }: { projects: Project[] }) {
  return (
    <>
      <div className="md:hidden">
        <ProjectStack projects={projects} />
      </div>
      <div className="hidden md:block">
        <ProjectGrid projects={projects} />
      </div>
    </>
  );
}

function ProjectStack({ projects }: { projects: Project[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-12 px-6 pb-24 pt-8">
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          initial={reduceMotion ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 24, filter: "blur(16px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href={`/projects/${project.id}`} className="group/card block">
            <CardMedia project={project} className="h-64 w-full" />
            <CardCaption project={project} />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function ProjectGrid({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollContainer = useScrollContainer();
  const reduceMotion = useReducedMotion();
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
  // Cards start blurred and sharpen on the same 0 -> 0.2 scroll window as the
  // rest of the reveal, so "scroll down to bring it into focus" reads as one
  // coherent motion rather than blur and tilt settling at different times.
  const blur = useSpring(useTransform(scrollYProgress, [0, 0.2], reduceMotion ? [0, 0] : [16, 0]), springConfig);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  const [firstRow, secondRow] = splitIntoRows(projects);

  return (
    <div
      ref={ref}
      className="relative flex h-[150vh] flex-col self-auto pt-24 pb-32 [perspective:1000px] [transform-style:preserve-3d]"
    >
      <motion.div style={{ rotateX, rotateZ, translateY, opacity, filter }}>
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

// Shared visual: the project photo, plain at rest, with a dark overlay +
// "View project" that cross-fades in on hover. Used by both the mobile
// stack and the desktop tilt grid so the two layouts read as the same
// design language, not two unrelated components.
function CardMedia({ project, className = "" }: { project: Project; className?: string }) {
  return (
    <div
      // Sharp corners are a deliberate deviation from SOFT_MEDIA_BOX (which
      // rounds by default) — kept to just the hairline border + diffused
      // shadow for this grid of project tiles.
      className={`relative overflow-hidden border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300 group-hover/card:shadow-[0_22px_60px_rgba(0,0,0,0.16)] ${className}`}
    >
      {project.image ? (
        <Image src={project.image} alt="" fill sizes="(min-width: 768px) 480px, 100vw" className="object-cover object-center" />
      ) : (
        <div className="absolute inset-0 h-full w-full bg-muted/25" />
      )}
      <div className="absolute inset-0 h-full w-full bg-foreground opacity-0 transition-opacity duration-300 group-hover/card:opacity-80" />
      <span className="absolute bottom-4 left-4 text-sm font-semibold text-background opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
        View project →
      </span>
    </div>
  );
}

function CardCaption({ project }: { project: Project }) {
  return (
    <div className="mt-3">
      <h3 className="text-lg font-bold">{project.name}</h3>
      {project.tech && <p className="mt-1 text-xs text-muted">{project.tech.join(" · ")}</p>}
    </div>
  );
}

function ProjectCard({ project, translate }: { project: Project; translate: MotionValue<number> }) {
  return (
    <motion.div style={{ x: translate }} whileHover={{ y: -12 }} className="group/card w-[30rem] shrink-0">
      <Link href={`/projects/${project.id}`} className="block">
        <CardMedia project={project} className="h-80 w-full" />
        <CardCaption project={project} />
      </Link>
    </motion.div>
  );
}
