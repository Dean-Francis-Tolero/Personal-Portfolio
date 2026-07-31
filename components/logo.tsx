"use client";

import Image from "next/image";
import Link from "next/link";
import { useNavLinkClick } from "./page_transition";

export default function Logo() {
  const onClick = useNavLinkClick("/");
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Home"
      // z-[60]: above Nav's old z-50 and any page content (e.g. the Projects
      // entry template's full-bleed sections, which run right up to the
      // viewport edge under this and are fine sitting underneath it) —
      // below the lightbox overlay (z-100), which should cover everything.
      className="fixed top-6 left-6 z-[60] block h-16 w-16 overflow-hidden rounded-full transition-transform hover:scale-105"
    >
      <Image src="/icon.png" alt="" width={64} height={64} priority className="h-full w-full object-cover" />
    </Link>
  );
}
