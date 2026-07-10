"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import { text } from "stream/consumers";

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="fixed top-6 right-6">
      <ul className="flex flex-col gap-4 text-2xl font-bold text-right">
        <li><Link href="/" className={pathname === "/" ? "text-black" : "text-[#a7a7a7] hover:text-[#7A7979] transition-colors"}>HOME</Link></li>
        <li><Link href="/projects" className={pathname === "/projects" ? "text-black" : "text-[#a7a7a7] hover:text-[#7A7979] transition-colors"}>PROJECTS</Link></li>
        <li><Link href="/resume" className={pathname === "/resume" ? "text-black" : "text-[#a7a7a7] hover:text-[#7A7979] transition-colors"}>RESUME</Link></li>
        <li><Link href="/about" className={pathname === "/about" ? "text-black" : "text-[#a7a7a7] hover:text-[#7A7979] transition-colors"}>ABOUT</Link></li>
      </ul>
    </nav>
  );
};