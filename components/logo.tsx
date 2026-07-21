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
      className="fixed top-6 left-6 z-50 block h-16 w-16 overflow-hidden rounded-full transition-transform hover:scale-105"
    >
      <Image src="/icon.png" alt="" width={64} height={64} priority className="h-full w-full object-cover" />
    </Link>
  );
}
