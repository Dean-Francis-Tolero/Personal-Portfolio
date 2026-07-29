import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";
import { getProjectSlugs } from "../lib/project_data";
import { getExperienceSlugs } from "../lib/experience_data";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = ["", "/projects", "/experience", "/resume"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
  }));

  const projectRoutes = getProjectSlugs().map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
    lastModified,
  }));

  const experienceRoutes = getExperienceSlugs().map((slug) => ({
    url: `${SITE_URL}/experience/${slug}`,
    lastModified,
  }));

  return [...staticRoutes, ...projectRoutes, ...experienceRoutes];
}
