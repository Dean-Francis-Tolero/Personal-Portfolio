"use client";

import { toMedia } from "../lib/media";
import type { ProjectFigure } from "../lib/resume_data";
import { useLightbox, ExpandHint } from "./lightbox";

export function ProjectFigures({
  figures,
  startIndex = 0,
}: {
  figures?: ProjectFigure[];
  startIndex?: number;
}) {
  const { open } = useLightbox();

  if (!figures || figures.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      {figures.map((figure, i) => {
        const media = toMedia(figure.src);
        const reversed = i % 2 === 1;

        return (
          <div key={figure.src} className="figure-card">
            <button
              type="button"
              className={`figure-media md:col-span-5${reversed ? " md:order-2" : ""}`}
              onClick={() => open(media.src, media.isVideo)}
              aria-label="Enlarge image"
            >
              {media.isVideo ? (
                <video src={media.src} autoPlay loop muted playsInline />
              ) : (
                <img src={media.src} alt="" />
              )}
              {media.isVideo && <span className="media-play-icon" aria-hidden="true" />}
              <ExpandHint />
            </button>
            <div
              className={`flex items-start gap-4 md:col-span-7${reversed ? " md:order-1" : ""}`}
            >
              <span className="clay-badge shrink-0">
                {String(startIndex + i + 1).padStart(2, "0")}
              </span>
              <p className="text-base md:text-lg font-medium text-muted-strong leading-relaxed">
                {figure.caption}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
