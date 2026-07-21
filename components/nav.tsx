"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LINK_UNDERLINE } from "../lib/styles";
import { useNavLinkClick } from "./page_transition";

const NAV_ITEMS = [
  { href: "/", label: "HOME" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/resume", label: "RESUME" },
  { href: "/experience", label: "EXPERIENCE" },
];

const NavLink = memo(function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  const onClick = useNavLinkClick(href);
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${LINK_UNDERLINE} ${
        active ? "text-foreground" : "text-muted hover:text-muted-strong transition-colors"
      }`}
    >
      {label}
    </Link>
  );
});

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="fixed top-6 right-6 z-50">
      <ul className="flex flex-col gap-4 text-2xl font-bold text-right">
        {NAV_ITEMS.map(({ href, label }) => (
          <li key={href}>
            <NavLink href={href} label={label} active={pathname === href} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
