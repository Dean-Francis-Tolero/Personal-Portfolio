import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import { LINK_UNDERLINE } from "./lib/styles";

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
  img: (props) => (
    <Image
      sizes="100vw"
      width={0}
      height={0}
      style={{ width: "100%", height: "auto" }}
      className="my-6"
      {...(props as ImageProps)}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
