import type { Metadata } from "next";
import ProjectsContent from "../../components/projects_content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A collection of projects exploring software engineering ideas in AI, systems, and web development.",
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
