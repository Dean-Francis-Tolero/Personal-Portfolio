import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";
import {
  getExperienceSlugs,
  formatExperienceDate,
  type ExperienceMeta,
} from "../../../lib/experience_data";
import { LINK_UNDERLINE } from "../../../lib/styles";

export function generateStaticParams() {
  return getExperienceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { metadata } = (await import(`../../../content/experience/${slug}.mdx`)) as {
      metadata: ExperienceMeta;
    };
    return {
      title: metadata.title,
      description: metadata.summary,
      openGraph: { title: metadata.title, description: metadata.summary },
      twitter: { card: "summary", title: metadata.title, description: metadata.summary },
    };
  } catch {
    return {};
  }
}

// Overrides the shared mdx-components.tsx renderers just for this page's
// <Post />, giving Experience entries their own broadsheet treatment
// (column-spanning heads/figures/pull-quotes) without touching how the
// Projects "Paper" write-ups render — Next.js merges these with the global
// ones automatically (see node_modules/next/dist/docs .../mdx.md).
const broadsheetComponents: MDXComponents = {
  h2: ({ children }) => <h2 className="broadsheet-h2">{children}</h2>,
  blockquote: ({ children }) => (
    <blockquote className="broadsheet-pull">{children}</blockquote>
  ),
  img: ({ alt = "", src, width, height }) => (
    <span className="broadsheet-figure">
      <Image
        alt={alt as string}
        src={src as string}
        sizes="(min-width: 720px) 900px, 100vw"
        width={typeof width === "number" ? width : 0}
        height={typeof height === "number" ? height : 0}
        style={{ width: "100%", height: "auto" }}
      />
    </span>
  ),
};

export default async function ExperienceEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let mod: {
    default: ComponentType<{ components?: MDXComponents }>;
    metadata: ExperienceMeta;
  };
  try {
    mod = (await import(`../../../content/experience/${slug}.mdx`)) as typeof mod;
  } catch {
    notFound();
  }

  const { default: Post, metadata } = mod;

  return (
    <main className="min-h-screen">
      <article className="pb-24">
        <div className="max-w-[900px] mx-auto w-full px-6 md:px-10 pt-40 md:pt-52">
          <header className="broadsheet-masthead">
            <Link
              href="/experience"
              className={`${LINK_UNDERLINE} broadsheet-kicker`}
            >
              ← Experience
            </Link>
            <h1 className="broadsheet-headline">{metadata.title}</h1>
            {metadata.summary && <p className="broadsheet-dek">{metadata.summary}</p>}
            <div className="broadsheet-byline">
              <span>Dean Francis Tolero</span>
              <span aria-hidden="true">&middot;</span>
              <span>{formatExperienceDate(metadata.date)}</span>
            </div>
          </header>

          <div className="broadsheet-body mt-10">
            <Post components={broadsheetComponents} />
          </div>
        </div>
      </article>
    </main>
  );
}
