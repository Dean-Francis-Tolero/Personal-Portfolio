import { projects, type Project } from "./resume_data";

export function getProjectSlugs(): string[] {
  return projects.map((project) => project.id);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.id === slug);
}
