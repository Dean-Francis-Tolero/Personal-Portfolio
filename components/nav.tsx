"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LINK_UNDERLINE } from "../lib/styles";

const NAV_ITEMS = [
  { href: "/", label: "HOME" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/resume", label: "RESUME" },
  { href: "/about", label: "ABOUT" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="fixed top-6 right-6 z-50">
      <ul className="flex flex-col gap-4 text-2xl font-bold text-right">
        {NAV_ITEMS.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`${LINK_UNDERLINE} ${
                pathname === href
                  ? "text-foreground"
                  : "text-muted hover:text-muted-strong transition-colors"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}