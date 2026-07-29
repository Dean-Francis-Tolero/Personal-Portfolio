import type { Metadata } from "next";
import HomeContent from "../components/home_content";

export const metadata: Metadata = {
  description:
    "Sonder, a digital playground and personal portfolio exploring software engineering, AI, and design.",
};

export default function Home() {
  return <HomeContent />;
}
