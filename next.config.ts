import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    viewTransition: true,
  },
  allowedDevOrigins: ["192.168.1.68"],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
