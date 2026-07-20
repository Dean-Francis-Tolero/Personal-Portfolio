import Link from "next/link";
import { getExperienceEntries, formatExperienceDate } from "../../lib/experience_data";
import { ROW_FILL_HOVER } from "../../lib/styles";

export default async function ExperiencePage() {
  const entries = await getExperienceEntries();

  return (
    <main>
      <div className="max-w-7xl mx-auto w-full px-10 pt-40 md:pt-52 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">
          <div className="md:col-span-4 md:sticky md:top-40 md:self-start">
            <h1 className="text-4xl md:text-6xl font-bold inline-block">
              Experience
              <span className="align-top ml-2 text-xl md:text-2xl text-muted">
                ({entries.length})
              </span>
            </h1>
            <p className="mt-6 max-w-xs text-lg font-medium text-muted">
              Competitions, wins, and moments along the way — the parts of the
              journey that don&apos;t quite fit under &quot;projects.&quot;
            </p>
          </div>

          <div className="md:col-span-8">
            <div className="hidden md:flex items-center gap-8 border-b border-foreground/10 pb-2 px-4 md:px-8 uppercase text-xs font-bold tracking-wide text-muted">
              <span className="w-28 shrink-0">Date</span>
              <span>Title</span>
            </div>

            <ul>
              {entries.map((entry) => (
                <li key={entry.slug} className="border-b border-foreground/10">
                  <Link
                    href={`/experience/${entry.slug}`}
                    className={`flex items-center gap-4 md:gap-8 h-20 px-4 md:px-8 ${ROW_FILL_HOVER}`}
                  >
                    <span className="w-28 shrink-0 uppercase text-xs md:text-sm font-extrabold">
                      {formatExperienceDate(entry.date)}
                    </span>
                    <span className="text-xl md:text-2xl font-bold truncate">
                      {entry.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
