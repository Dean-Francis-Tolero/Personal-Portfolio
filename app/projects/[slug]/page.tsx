import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";
import { getProjectSlugs, getProjectBySlug } from "../../../lib/project_data";
import { LINK_UNDERLINE } from "../../../lib/styles";
import { ProjectPoster } from "../../../components/project_poster";
import { ProjectFigures } from "../../../components/project_figures";
import { LightboxProvider } from "../../../components/lightbox";

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

type PaperMeta = {
  title?: string;
};

// Overrides the shared mdx-components.tsx renderers just for this page's
// <Paper />, giving Project write-ups their own numbered-section "dossier"
// treatment (claymorphism badges, chip-style inline code) without touching
// how Experience entries render — Next.js merges this with the global set
// automatically (confirmed against node_modules/next/dist/docs, see AGENTS.md).
const dossierComponents: MDXComponents = {
  h2: ({ children }) => <h2 className="dossier-h2">{children}</h2>,
  code: ({ children }) => <code className="dossier-code">{children}</code>,
};

export default async function ProjectEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  // Split any extra figures into two groups so a project's visuals (each
  // discussed in its own captioned section) are spread across the page,
  // mid-page and after the write-up, instead of bunched into one block up
  // top with the hero image. Numbering continues across both groups.
  const figures = project.figures ?? [];
  const figuresMidpoint = Math.ceil(figures.length / 2);
  const figuresGroupOne = figures.slice(0, figuresMidpoint);
  const figuresGroupTwo = figures.slice(figuresMidpoint);

  // Paper write-up is optional per project — only some projects have one yet.
  let Paper: ComponentType<{ components?: MDXComponents }> | null = null;
  try {
    const mod = (await import(`../../../content/projects/${slug}.mdx`)) as {
      default: ComponentType<{ components?: MDXComponents }>;
      metadata?: PaperMeta;
    };
    Paper = mod.default;
  } catch {
    Paper = null;
  }

  return (
    <main className="min-h-screen">
      <LightboxProvider>
        <article className="max-w-6xl mx-auto w-full px-6 md:px-10 pt-40 md:pt-52 pb-24">
          <Link
            href="/projects"
            className={`${LINK_UNDERLINE} text-sm font-bold uppercase text-muted`}
          >
            ← Projects
          </Link>

          <div className="grid gap-10 md:grid-cols-12 md:gap-12 md:items-center mt-6">
            <div className="md:col-span-5">
              <h1 className="text-4xl md:text-5xl font-bold leading-[0.95] tracking-tight">
                {project.name}
              </h1>
              <p className="mt-5 text-lg md:text-xl font-medium text-muted-strong">
                {project.description}
              </p>

              {(project.tech || project.link || project.paper) && (
                <div className="flex flex-wrap gap-3 mt-8">
                  {project.tech?.map((t) => (
                    <span key={t} className="clay-chip">
                      {t}
                    </span>
                  ))}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="clay-chip"
                    >
                      View on GitHub ↗
                    </a>
                  )}
                  {project.paper && (
                    <a
                      href={project.paper}
                      target="_blank"
                      rel="noreferrer"
                      className="clay-chip"
                    >
                      Read the Paper ↗
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="md:col-span-7">
              <ProjectPoster image={project.image} />
            </div>
          </div>

          {project.bullets && (
            <div className="poster-captions mt-16 border-t border-foreground/10 pt-12">
              <span className="poster-captions-kicker">Highlights</span>
              <ol>
                {project.bullets.map((bullet, i) => (
                  <li key={i} className="poster-caption">
                    <span className="clay-badge">{i + 1}</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-16">
            <ProjectFigures figures={figuresGroupOne} />
          </div>

          <div className="mt-16 border-t border-foreground/10 pt-16">
            <h2 className="text-2xl font-bold md:text-3xl">The Write-Up</h2>
            {Paper ? (
              <div className="dossier-body mt-8 max-w-3xl">
                <Paper components={dossierComponents} />
              </div>
            ) : (
              <p className="mt-6 italic text-muted">Write-up coming soon.</p>
            )}
          </div>

          <div className="mt-16">
            <ProjectFigures figures={figuresGroupTwo} startIndex={figuresGroupOne.length} />
          </div>
        </article>
      </LightboxProvider>
    </main>
  );
}
