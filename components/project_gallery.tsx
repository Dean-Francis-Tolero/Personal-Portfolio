"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { toMedia } from "../lib/media";
import { SOFT_MEDIA_BOX } from "../lib/styles";
import type { ProjectFigure } from "../lib/resume_data";
import { useLightbox } from "./lightbox";

type GalleryItem = {
  src: string;
  // what the lightbox opens to, if it should differ from `src` (the cell's
  // own thumbnail). Falls back to `src` when unset.
  full?: string;
  caption?: string;
  badge?: string;
};

const GRID_SIZE = 4;

// A single 2x2 Swiss-grid contact sheet: the project's main `image` first,
// then each `figures[]` entry. Fills nearly the whole viewport (a thin gap,
// no fixed aspect ratio — the row/column tracks size the cells) rather than
// sitting as a small centered block, so the images do the talking. A
// project with fewer than four images just leaves the remaining grid cells
// empty — no filler placeholders. A project with more than four (the grid
// itself never grows past 2x2, no second gallery slide) shows only the
// first three individually; the 4th cell dims its image under a "+N"
// overlay (N = every photo not otherwise shown) and opens the lightbox onto
// that full remaining set in prev/next gallery mode. Degrades gracefully to
// nothing when a project has no image/figures at all.
export function ProjectGallery({
  image,
  coverThumbnail,
  figures,
}: {
  image?: string;
  coverThumbnail?: string;
  figures?: ProjectFigure[];
}) {
  const items: GalleryItem[] = [];
  if (image) items.push({ src: coverThumbnail ?? image, full: image });
  figures?.forEach((figure, i) => {
    items.push({
      src: figure.src,
      full: figure.full,
      caption: figure.caption,
      badge: String(i + 1).padStart(2, "0"),
    });
  });

  if (items.length === 0) return null;

  const visible = items.slice(0, GRID_SIZE);
  const overflow = items.length > GRID_SIZE ? items.slice(GRID_SIZE - 1) : undefined;

  return (
    <section
      data-slide
      className="flex min-h-dvh flex-col px-6 py-10 md:px-10 md:py-12"
    >
      <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-3 md:gap-4">
        {visible.map((item, i) => (
          <GalleryCell
            key={item.src}
            item={item}
            overflow={i === GRID_SIZE - 1 ? overflow : undefined}
          />
        ))}
      </div>
    </section>
  );
}

function GalleryCell({
  item,
  overflow,
}: {
  item: GalleryItem;
  overflow?: GalleryItem[];
}) {
  const { open, openGallery } = useLightbox();
  const reduceMotion = useReducedMotion();
  const media = toMedia(item.src);
  const fullMedia = toMedia(item.full ?? item.src);
  const hasOverflow = !!overflow && overflow.length > 1;

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.94 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, margin: "-10% 0px -10% 0px" },
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
      };

  const handleClick = () => {
    if (hasOverflow) {
      openGallery(
        overflow.map((o) => ({
          ...toMedia(o.full ?? o.src),
          caption: o.caption,
          badge: o.badge,
        })),
        0
      );
    } else {
      open(fullMedia.src, fullMedia.isVideo, item.caption, item.badge);
    }
  };

  return (
    <motion.button
      type="button"
      className={`project-gallery-cell relative h-full w-full cursor-pointer overflow-hidden ${SOFT_MEDIA_BOX}`}
      onClick={handleClick}
      aria-label={
        hasOverflow
          ? `View ${overflow.length} more photos`
          : item.caption
            ? `Enlarge: ${item.caption}`
            : "Enlarge image"
      }
      {...reveal}
    >
      <motion.div
        className="relative h-full w-full"
        whileHover={reduceMotion ? {} : { scale: 1.05 }}
        whileFocus={reduceMotion ? {} : { scale: 1.05 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
      </motion.div>
      {hasOverflow && (
        <span className="project-gallery-overlay" aria-hidden="true">
          +{overflow.length}
        </span>
      )}
    </motion.button>
  );
}
