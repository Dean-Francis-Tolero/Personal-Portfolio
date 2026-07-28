import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import { LINK_UNDERLINE, SOFT_MEDIA_BOX, FULL_BLEED } from "./lib/styles";

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl md:text-4xl font-bold mt-10 mb-4 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-3">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-2">{children}</h3>,
  p: ({ children }) => (
    <p className="text-lg leading-relaxed mb-5 font-medium">{children}</p>
  ),
  a: ({ children, ...props }) => (
    <a {...props} className={`${LINK_UNDERLINE} font-semibold`}>
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="list-disc pl-6 mb-5 space-y-2 text-lg">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-lg">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-foreground/20 pl-4 italic text-muted mb-5">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-foreground/10 my-8" />,
  // Breaks images out wider than the text column instead of squeezing them
  // into reading-line-width — nested <span> (not <div>) because markdown
  // wraps standalone images in a <p>, and a block-level div there would get
  // split out by the browser's HTML parser; span keeps it valid.
  img: ({ alt = "", ...props }) => (
    <span className={`my-8 block ${FULL_BLEED}`}>
      <span className="mx-auto block max-w-5xl px-6 md:px-10">
        <Image
          alt={alt}
          sizes="100vw"
          width={0}
          height={0}
          style={{ width: "100%", height: "auto" }}
          {...(props as Omit<ImageProps, "alt">)}
        />
      </span>
    </span>
  ),
  // Renders a LinkedIn "Embed this post" iframe. Paste the src, width, and
  // height straight from LinkedIn's own embed snippet (post's "..." menu ->
  // "Embed this post") — width/height set the aspect ratio, not a fixed size.
  LinkedInEmbed: ({
    src,
    width = 504,
    height = 898,
    title = "Embedded LinkedIn post",
  }: {
    src: string;
    width?: number;
    height?: number;
    title?: string;
  }) => (
    <div
      className={`relative mx-auto my-6 w-full max-w-md ${SOFT_MEDIA_BOX}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <iframe
        src={src}
        title={title}
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
