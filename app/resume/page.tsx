import type { Metadata } from "next";
import ResumeContent from "../../components/resume_content";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume and background of Dean Francis Tolero, a Computer Science student and software engineer.",
};

export default function ResumePage() {
  return <ResumeContent />;
}
