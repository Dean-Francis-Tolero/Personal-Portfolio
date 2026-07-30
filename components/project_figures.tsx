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
        const badge = String(startIndex + i + 1).padStart(2, "0");

        return (
          <button
            key={figure.src}
            type="button"
            className="figure-card"
            onClick={() => open(media.src, media.isVideo, figure.caption, badge)}
            aria-label={`Enlarge figure ${badge}`}
          >
            <div className={`figure-media md:col-span-5${reversed ? " md:order-2" : ""}`}>
              {media.isVideo ? (
                <video src={media.src} autoPlay loop muted playsInline />
              ) : (
                <img src={media.src} alt="" />
              )}
              {media.isVideo && <span className="media-play-icon" aria-hidden="true" />}
              <ExpandHint />
            </div>
            <div
              className={`flex items-start gap-4 md:col-span-7${reversed ? " md:order-1" : ""}`}
            >
              <span className="clay-badge shrink-0">{badge}</span>
              <p className="text-base md:text-lg font-medium text-muted-strong leading-relaxed">
                {figure.caption}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
