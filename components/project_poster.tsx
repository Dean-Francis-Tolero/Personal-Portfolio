"use client";

import Image from "next/image";
import { toMedia } from "../lib/media";
import { useLightbox, ExpandHint } from "./lightbox";

export function ProjectPoster({ image }: { image?: string }) {
  const media = image ? toMedia(image) : null;
  const { open } = useLightbox();

  return (
    <section className="poster-panel">
      {media ? (
        <button
          type="button"
          className="poster-media w-full"
          onClick={() => open(media.src, media.isVideo)}
          aria-label="Enlarge image"
        >
          {media.isVideo ? (
            <video src={media.src} autoPlay loop muted playsInline />
          ) : (
            <Image src={media.src} alt="" fill sizes="(min-width: 768px) 60vw, 100vw" />
          )}
          <ExpandHint />
        </button>
      ) : (
        <div className="poster-media-placeholder">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-9 w-9 text-muted/60"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="8.5" cy="10" r="1.5" />
            <path d="M21 15l-5-5-4 4-3-3-5 5" />
          </svg>
          <span>Visual coming soon</span>
        </div>
      )}
    </section>
  );
}
