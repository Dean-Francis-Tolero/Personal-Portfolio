"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { toMedia } from "../lib/media";
import { SOFT_MEDIA_BOX } from "../lib/styles";
import type { ProjectFigure } from "../lib/resume_data";
import { useLightbox, ExpandHint } from "./lightbox";

type GalleryItem = {
  src: string;
  caption?: string;
  badge?: string;
};

const PAGE_SIZE = 4;

// A 2x2 Swiss-grid contact sheet: the project's main `image` first, then
// each `figures[]` entry, paginated four-per-slide so a project with many
// shots gets several grid slides instead of one overcrowded page. Each grid
// fills nearly the whole viewport (a thin gap, no fixed aspect ratio — the
// row/column tracks size the cells) rather than sitting as a small centered
// block, so the images do the talking. A project with fewer than four
// images on its last page just leaves the remaining grid cells empty — no
// filler placeholders. Degrades gracefully to nothing when a project has no
// image/figures at all.
export function ProjectGallery({
  image,
  figures,
}: {
  image?: string;
  figures?: ProjectFigure[];
}) {
  const items: GalleryItem[] = [];
  if (image) items.push({ src: image });
  figures?.forEach((figure, i) => {
    items.push({
      src: figure.src,
      caption: figure.caption,
      badge: String(i + 1).padStart(2, "0"),
    });
  });

  if (items.length === 0) return null;

  const pages: GalleryItem[][] = [];
  for (let i = 0; i < items.length; i += PAGE_SIZE) {
    pages.push(items.slice(i, i + PAGE_SIZE));
  }

  return (
    <>
      {pages.map((page, i) => (
        <GalleryPageSection key={i} items={page} />
      ))}
    </>
  );
}

function GalleryPageSection({ items }: { items: GalleryItem[] }) {
  return (
    <section
      data-slide
      className="flex min-h-dvh flex-col px-6 py-10 md:px-10 md:py-12"
    >
      <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-3 md:gap-4">
        {items.map((item) => (
          <GalleryCell key={item.src} item={item} />
        ))}
      </div>
    </section>
  );
}

function GalleryCell({ item }: { item: GalleryItem }) {
  const { open } = useLightbox();
  const reduceMotion = useReducedMotion();
  const media = toMedia(item.src);

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.94 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, margin: "-10% 0px -10% 0px" },
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <motion.button
      type="button"
      className={`project-gallery-cell relative h-full w-full cursor-zoom-in ${SOFT_MEDIA_BOX}`}
      onClick={() => open(media.src, media.isVideo, item.caption, item.badge)}
      aria-label={item.caption ? `Enlarge: ${item.caption}` : "Enlarge image"}
      {...reveal}
    >
      {media.isVideo ? (
        <>
          <video
            src={media.src}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
          <span className="media-play-icon" aria-hidden="true" />
        </>
      ) : (
        <Image
          src={media.src}
          alt=""
          fill
          sizes="(min-width: 768px) 46vw, 46vw"
          className="object-cover"
        />
      )}
      <ExpandHint />
      {item.caption && (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8 text-left text-xs font-medium text-white md:text-sm">
          {item.badge && (
            <span className="mr-2 font-bold tabular-nums text-white/70">{item.badge}</span>
          )}
          {item.caption}
        </span>
      )}
    </motion.button>
  );
}
