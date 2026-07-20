import fs from "fs";
import path from "path";

export type ExperienceMeta = {
  title: string;
  date: string; // ISO "YYYY-MM-DD"
  summary?: string;
};

export type ExperienceEntry = ExperienceMeta & { slug: string };

const CONTENT_DIR = path.join(process.cwd(), "content", "experience");

export function getExperienceSlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export async function getExperienceEntries(): Promise<ExperienceEntry[]> {
  const slugs = getExperienceSlugs();
  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = (await import(`@/content/experience/${slug}.mdx`)) as {
        metadata: ExperienceMeta;
      };
      return { slug, ...metadata };
    })
  );

  return entries.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function formatExperienceDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
