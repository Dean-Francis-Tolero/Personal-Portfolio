import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectSlugs, getProjectBySlug, getProjectPosition } from "../../../lib/project_data";
import { ProjectHero } from "../../../components/project_hero";
import { ProjectProblem } from "../../../components/project_problem";
import { ProjectProcess } from "../../../components/project_process";
import { ProjectDemo } from "../../../components/project_demo";
import { ProjectGallery } from "../../../components/project_gallery";
import { ProjectStats } from "../../../components/project_stats";
import { ProjectHighlights } from "../../../components/project_highlights";
import { ProjectSlideDeck } from "../../../components/project_slide_deck";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: project.name,
      description: project.description,
      images: project.image ? [{ url: project.image }] : undefined,
    },
    twitter: {
      card: project.image ? "summary_large_image" : "summary",
      title: project.name,
      description: project.description,
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default async function ProjectEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const position = getProjectPosition(slug);

  return (
    <main className="min-h-screen">
      <ProjectSlideDeck>
        <ProjectHero project={project} position={position} />
        <ProjectProblem problem={project.problem} />
        <ProjectProcess
          headline={project.processHeadline}
          diagram={project.processDiagram}
          steps={project.processSteps}
        />
        <ProjectDemo headline={project.demoHeadline} clips={project.demoClips} />
        <ProjectGallery
          image={project.image}
          imageDimensions={project.imageDimensions}
          figures={project.figures}
        />
        <ProjectStats stats={project.stats} />
        <ProjectHighlights bullets={project.bullets} future={project.future} />
      </ProjectSlideDeck>
    </main>
  );
}
