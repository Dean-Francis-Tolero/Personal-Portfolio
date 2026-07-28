import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { getProjectSlugs, getProjectBySlug } from "../../../lib/project_data";
import { LINK_UNDERLINE, SOFT_MEDIA_BOX } from "../../../lib/styles";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

type PaperMeta = {
  title?: string;
};

export default async function ProjectEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  // Paper write-up is optional per project — only some projects have one yet.
  let Paper: ComponentType | null = null;
  try {
    const mod = (await import(`../../../content/projects/${slug}.mdx`)) as {
      default: ComponentType;
      metadata?: PaperMeta;
    };
    Paper = mod.default;
  } catch {
    Paper = null;
  }

  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto w-full px-10 pt-40 md:pt-52 pb-24">
        <Link
          href="/projects"
          className={`${LINK_UNDERLINE} text-sm font-bold uppercase text-muted`}
        >
          ← Projects
        </Link>

        <h1 className="text-3xl md:text-5xl font-bold mt-6">{project.name}</h1>
        {project.tech && (
          <p className="mt-3 text-sm font-bold uppercase text-muted">
            {project.tech.join(" · ")}
          </p>
        )}

        {project.image && (
          <div className={`relative mt-10 h-72 w-full md:h-96 ${SOFT_MEDIA_BOX}`}>
            <img
              src={project.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
        )}

        <p className="mt-10 text-lg font-medium text-muted">{project.description}</p>

        {project.bullets && (
          <ul className="mt-6 list-inside list-disc space-y-2 text-lg font-medium">
            {project.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        )}

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className={`${LINK_UNDERLINE} mt-8 inline-block font-bold`}
          >
            View project ↗
          </a>
        )}

        <div className="mt-16 border-t border-foreground/10 pt-16">
          <h2 className="text-2xl font-bold md:text-3xl">The Paper</h2>
          {Paper ? (
            <div className="mt-8">
              <Paper />
            </div>
          ) : (
            <p className="mt-6 italic text-muted">Write-up coming soon.</p>
          )}
        </div>
      </article>
    </main>
  );
}
