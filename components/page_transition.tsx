"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useTransition,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  CURTAIN_COVER_S,
  CURTAIN_COVER_EASE,
  CURTAIN_HOLD_MS,
  CURTAIN_SLIDE_S,
  CURTAIN_SLIDE_EASE,
} from "../lib/transition_timing";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const CURTAIN_HIDDEN = { y: "100%", rotate: 0, clipPath: "inset(0%)" };
const CURTAIN_START = { y: "0%", rotate: 30, clipPath: "inset(49.9%)" };
const CURTAIN_COVERED = { y: "0%", rotate: 0, clipPath: "inset(0%)" };

type NavigateFn = (href: string) => void;

const PageTransitionContext = createContext<NavigateFn | null>(null);

export function usePageTransition() {
  const navigate = useContext(PageTransitionContext);
  if (!navigate) throw new Error("usePageTransition must be used within PageTransitionProvider");
  return navigate;
}

// Shared click handler for any nav-style <Link>: skips same-page clicks and
// modifier-key/middle clicks (so ctrl/cmd-click-to-open-in-new-tab keeps
// working), otherwise takes over navigation so the curtain can cover the old
// page before the route actually changes underneath it. Reads the current
// path directly off the browser at click time rather than subscribing to
// usePathname(), so this hook doesn't force every link (and Logo) to
// re-render on every navigation just to know if it's the active one.
export function useNavLinkClick(href: string) {
  const navigate = usePageTransition();

  return useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (
        href === window.location.pathname ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      event.preventDefault();
      navigate(href);
    },
    [href, navigate]
  );
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const controls = useAnimation();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const busyRef = useRef(false);

  // router.push() doesn't return a promise, and client navigation can take
  // anywhere from a few ms (cached route) to several hundred ms (render on
  // navigate) — so the slide-away reveal must wait for the real navigation
  // to finish rendering, not a fixed timer. Navigations are React Transitions
  // in the App Router, so useTransition's isPending is the actual completion
  // signal; a fixed delay here previously let the reveal race ahead of the
  // page swap and briefly show the old page mid-slide.
  const [isPending, startTransition] = useTransition();
  const navResolveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isPending && navResolveRef.current) {
      navResolveRef.current();
      navResolveRef.current = null;
    }
  }, [isPending]);

  const waitForNavigation = useCallback(
    (href: string) =>
      new Promise<void>((resolve) => {
        navResolveRef.current = resolve;
        startTransition(() => {
          router.push(href);
        });
      }),
    [router, startTransition]
  );

  const navigate = useCallback<NavigateFn>(
    (href) => {
      if (busyRef.current) return;

      if (reduceMotion) {
        router.push(href);
        return;
      }

      busyRef.current = true;
      (async () => {
        // Old page stays fully visible underneath while the curtain covers it.
        controls.set(CURTAIN_START);
        await controls.start({
          ...CURTAIN_COVERED,
          transition: { duration: CURTAIN_COVER_S, ease: CURTAIN_COVER_EASE },
        });

        // Screen is fully covered now — safe to swap the page underneath.
        // Wait for the new page to actually finish rendering before revealing it.
        await waitForNavigation(href);
        await sleep(CURTAIN_HOLD_MS);

        await controls.start({
          ...CURTAIN_HIDDEN,
          transition: { duration: CURTAIN_SLIDE_S, ease: CURTAIN_SLIDE_EASE },
        });

        busyRef.current = false;
      })();
    },
    [controls, reduceMotion, router, waitForNavigation]
  );

  return (
    <PageTransitionContext.Provider value={navigate}>
      <motion.div
        aria-hidden
        initial={CURTAIN_HIDDEN}
        animate={controls}
        className="pointer-events-none fixed inset-0 z-[9999] bg-foreground"
      />
      {children}
    </PageTransitionContext.Provider>
  );
}
