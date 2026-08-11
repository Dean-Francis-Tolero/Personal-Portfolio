import { ProjectPhotoCarousel } from "./project_photo_carousel";
import type { ProjectFigure, ImageDimensions } from "../lib/resume_data";

// The project's main `image` first, then each `figures[]` entry, shown as
// one ProjectPhotoCarousel (see project_photo_carousel.tsx) — an
// Apple-product-page style horizontal strip you scroll/swipe through,
// replacing the old 2x2 SOFT_MEDIA_BOX contact sheet. Skips entirely when
// the project has no image/figures.
export function ProjectGallery({
  image,
  imageDimensions,
  figures,
}: {
  image?: string;
  imageDimensions?: ImageDimensions;
  figures?: ProjectFigure[];
}) {
  const items: { src: string; caption?: string; width: number; height: number }[] = [];
  if (image && imageDimensions) {
    items.push({ src: image, width: imageDimensions.width, height: imageDimensions.height });
  }
  figures?.forEach((figure) =>
    items.push({ src: figure.src, caption: figure.caption, width: figure.width, height: figure.height })
  );

  if (items.length === 0) return null;

  return <ProjectPhotoCarousel items={items} kicker="Gallery" />;
}
