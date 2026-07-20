import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import {
  getExperienceSlugs,
  formatExperienceDate,
  type ExperienceMeta,
} from "../../../lib/experience_data";
import { LINK_UNDERLINE } from "../../../lib/styles";

export function generateStaticParams() {
  return getExperienceSlugs().map((slug) => ({ slug }));
}

export default async function ExperienceEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let mod: { default: ComponentType; metadata: ExperienceMeta };
  try {
    mod = (await import(`../../../content/experience/${slug}.mdx`)) as typeof mod;
  } catch {
    notFound();
  }

  const { default: Post, metadata } = mod;

  return (
    <main>
      <article className="max-w-3xl mx-auto w-full px-10 pt-40 md:pt-52 pb-24">
        <Link
          href="/experience"
          className={`${LINK_UNDERLINE} text-sm font-bold uppercase text-muted`}
        >
          ← Experience
        </Link>
        <h1 className="text-3xl md:text-5xl font-bold mt-6">{metadata.title}</h1>
        <p className="mt-3 text-sm font-bold uppercase text-muted">
          {formatExperienceDate(metadata.date)}
        </p>
        <div className="mt-10">
          <Post />
        </div>
      </article>
    </main>
  );
}
