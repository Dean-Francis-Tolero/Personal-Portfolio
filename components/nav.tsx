"use client";

import { memo, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LINK_UNDERLINE } from "../lib/styles";
import { useNavLinkClick } from "./page_transition";
import { useScrollContainer } from "./scroll_container";

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
  onNavigate,
  className,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  const handleClick = useNavLinkClick(href);
  return (
    <Link
      href={href}
      onClick={(event) => {
        handleClick(event);
        onNavigate?.();
      }}
      className={`${LINK_UNDERLINE} ${
        active ? "text-foreground" : "text-muted hover:text-muted-strong transition-colors"
      } ${className ?? ""}`}
    >
      {label}
    </Link>
  );
});

const PILL_BUTTON =
  "h-11 rounded-full border border-black/5 bg-background px-5 text-sm font-bold uppercase tracking-wide text-foreground shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const scrollContainerRef = useScrollContainer();

  // Close on route change, Escape, and lock background scroll while open.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const container = scrollContainerRef?.current;
    const previousOverflow = container?.style.overflow;
    if (container) container.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (container) container.style.overflow = previousOverflow ?? "";
    };
  }, [open, scrollContainerRef]);

  return (
    <>
      <nav aria-label="Primary" className="fixed top-6 right-6 z-50">
        {/* Desktop: unchanged, always-visible link list */}
        <ul className="hidden md:flex flex-col gap-4 text-2xl font-bold text-right">
          {NAV_ITEMS.map(({ href, label }) => (
            <li key={href}>
              <NavLink href={href} label={label} active={pathname === href} />
            </li>
          ))}
        </ul>

        {/* Mobile: compact trigger, opens the slide-in drawer below */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className={`md:hidden ${PILL_BUTTON} ${open ? "pointer-events-none opacity-0" : ""} transition-opacity`}
        >
          Menu
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <div className="md:hidden">
            <motion.div
              key="backdrop"
              aria-hidden="true"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-foreground/40"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
            <motion.div
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 right-0 z-50 flex w-[78%] max-w-xs flex-col bg-background shadow-[-16px_0_45px_rgba(0,0,0,0.4)]"
              initial={reduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: [0.65, 0, 0.35, 1] }}
            >
              {/* The outer box-shadow above reads as almost invisible against
                  the already-dimmed backdrop (dark shadow on dark overlay).
                  This inner-edge gradient sits against the drawer's own light
                  background instead, where it has real contrast to work with. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/15 to-transparent"
              />

              <div className="flex justify-end p-6">
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className={PILL_BUTTON}
                >
                  Close
                </button>
              </div>
              <ul className="mt-4 flex flex-col gap-5 px-8 pb-10 text-2xl font-bold">
                {NAV_ITEMS.map(({ href, label }) => (
                  <li key={href}>
                    <NavLink
                      href={href}
                      label={label}
                      active={pathname === href}
                      onNavigate={() => setOpen(false)}
                    />
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
