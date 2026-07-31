"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(ScrollTrigger, Observer);

type ScrollContainerContextValue = {
  ref: RefObject<HTMLElement | null>;
  lenisRef: RefObject<Lenis | null>;
  setLocked: (locked: boolean) => void;
};

const ScrollContainerContext = createContext<ScrollContainerContextValue | null>(null);

export function useScrollContainer() {
  return useContext(ScrollContainerContext)?.ref ?? null;
}

// The Lenis instance itself — for anything that needs to drive scroll
// programmatically (e.g. the Projects entry page's wheel-jacked slide deck)
// rather than just reading the wrapper element, since a plain native
// `scrollTo` would fight Lenis's own smoothing/state.
export function useLenis() {
  return useContext(ScrollContainerContext)?.lenisRef ?? null;
}

// Locks/unlocks the scroll container's overflow while `locked` is true —
// shared by anything that needs to freeze background scroll behind an
// overlay (the mobile nav drawer, the lightbox). Drives a class toggle in
// ScrollContainerProvider's own render rather than reaching into the
// container's DOM node and mutating its style directly, so nothing outside
// this module ever mutates a ref/context value returned by a hook.
export function useScrollLock(locked: boolean) {
  const ctx = useContext(ScrollContainerContext);

  useEffect(() => {
    ctx?.setLocked(locked);
    return () => ctx?.setLocked(false);
  }, [locked, ctx]);
}

export function ScrollContainerProvider({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const wrapper = ref.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    // content must be a distinct element from wrapper: wrapper is pinned to h-full (so its own
    // box never changes size), while content sizes naturally to whatever page is mounted inside
    // it — Lenis needs content's own box to actually change size to know a recompute is due.
    const lenis = new Lenis({ wrapper, content });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Lenis's own autoResize recomputes on a ~250ms debounce, which is slow enough that a user
    // scrolling right after a route change can get a wheel event computed against the outgoing
    // page's (too-small) limit — and Lenis doesn't retry once the limit corrects. Watching
    // content's own box size directly, with no debounce, keeps the limit correct the instant
    // the new page's DOM actually lands.
    const resizeObserver = new ResizeObserver(() => lenis.resize());
    resizeObserver.observe(content);

    return () => {
      resizeObserver.disconnect();
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const contextValue = useMemo(() => ({ ref, lenisRef, setLocked }), []);

  return (
    <ScrollContainerContext.Provider value={contextValue}>
      <main
        ref={ref as RefObject<HTMLElement>}
        className={`relative ${className ?? ""} ${locked ? "!overflow-hidden" : ""}`}
      >
        <div ref={contentRef}>{children}</div>
      </main>
    </ScrollContainerContext.Provider>
  );
}
