"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useScrollLock } from "./scroll_container";

type LightboxMedia = {
  src: string;
  isVideo: boolean;
  caption?: string;
  badge?: string;
};
type LightboxContextValue = {
  open: (src: string, isVideo?: boolean, caption?: string, badge?: string) => void;
  // Opens onto a navigable set of media (currently just the gallery's "+N"
  // overflow tile) instead of a single fixed image, so prev/next arrows and
  // a counter appear.
  openGallery: (items: LightboxMedia[], startIndex?: number) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox(): LightboxContextValue {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within a LightboxProvider");
  return ctx;
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<LightboxMedia[]>([]);
  const [index, setIndex] = useState(0);
  const media = queue[index] ?? null;
  const reduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<Element | null>(null);

  const open = useCallback(
    (src: string, isVideo = false, caption?: string, badge?: string) => {
      triggerRef.current = document.activeElement;
      setQueue([{ src, isVideo, caption, badge }]);
      setIndex(0);
    },
    []
  );
  const openGallery = useCallback((items: LightboxMedia[], startIndex = 0) => {
    triggerRef.current = document.activeElement;
    setQueue(items);
    setIndex(startIndex);
  }, []);
  const close = useCallback(() => setQueue([]), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % queue.length), [queue.length]);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + queue.length) % queue.length),
    [queue.length]
  );

  // The overlay sits on top visually, but Lenis binds to the scroll
  // container regardless, so without this the page behind it still scrolls.
  useScrollLock(!!media);

  // Escape to close, arrow keys to navigate a multi-item queue, and move
  // focus to the close button so keyboard users land inside the dialog
  // immediately — restoring focus to whichever figure/poster button opened
  // it on close.
  useEffect(() => {
    if (!media) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight" && queue.length > 1) next();
      else if (e.key === "ArrowLeft" && queue.length > 1) prev();
    };
    document.addEventListener("keydown", onKey);

    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, [media, close, next, prev, queue.length]);

  const backdropMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2, ease: "easeOut" as const },
      };
  const panelMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96, y: 8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 8 },
        transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
      };

  const hasNav = queue.length > 1;

  return (
    <LightboxContext.Provider value={{ open, openGallery }}>
      {children}
      <AnimatePresence>
        {media && (
          <motion.div
            key="lightbox-overlay"
            className="lightbox-overlay"
            role="dialog"
            aria-modal="true"
            onClick={close}
            {...backdropMotion}
          >
            <motion.div
              key={media.src}
              className="lightbox-panel"
              onClick={(e) => e.stopPropagation()}
              {...panelMotion}
            >
              {media.isVideo ? (
                <video src={media.src} controls autoPlay loop muted playsInline />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={media.src} alt="" />
              )}
              {media.caption && (
                <p className="lightbox-caption">
                  {media.badge && <span className="lightbox-caption-badge">{media.badge}</span>}
                  {media.caption}
                </p>
              )}
            </motion.div>
            {hasNav && (
              <>
                <button
                  type="button"
                  className="lightbox-nav lightbox-nav-prev"
                  aria-label="Previous photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="lightbox-nav lightbox-nav-next"
                  aria-label="Next photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                >
                  ›
                </button>
                <span className="lightbox-counter">
                  {index + 1} / {queue.length}
                </span>
              </>
            )}
            <button
              ref={closeButtonRef}
              type="button"
              className="lightbox-close"
              aria-label="Close"
              onClick={close}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}

