import { projects, type Project } from "./resume_data";

export function getProjectSlugs(): string[] {
  return projects.map((project) => project.id);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.id === slug);
}

// 1-based position within the projects list, for the hero's "01 / 04"
// corner marker.
export function getProjectPosition(slug: string): { index: number; total: number } {
  const index = projects.findIndex((project) => project.id === slug);
  return { index: index + 1, total: projects.length };
}
