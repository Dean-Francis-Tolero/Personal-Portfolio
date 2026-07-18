"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollContainerContext = createContext<RefObject<HTMLElement | null> | null>(null);

export function useScrollContainer() {
  return useContext(ScrollContainerContext);
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

  useEffect(() => {
    const wrapper = ref.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    // content must be a distinct element from wrapper: wrapper is pinned to h-full (so its own
    // box never changes size), while content sizes naturally to whatever page is mounted inside
    // it — Lenis needs content's own box to actually change size to know a recompute is due.
    const lenis = new Lenis({ wrapper, content });

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
    };
  }, []);

  return (
    <ScrollContainerContext.Provider value={ref}>
      <main ref={ref as RefObject<HTMLElement>} className={className}>
        <div ref={contentRef}>{children}</div>
      </main>
    </ScrollContainerContext.Provider>
  );
}
