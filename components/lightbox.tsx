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
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox(): LightboxContextValue {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within a LightboxProvider");
  return ctx;
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [media, setMedia] = useState<LightboxMedia | null>(null);
  const reduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<Element | null>(null);

  const open = useCallback(
    (src: string, isVideo = false, caption?: string, badge?: string) => {
      triggerRef.current = document.activeElement;
      setMedia({ src, isVideo, caption, badge });
    },
    []
  );
  const close = useCallback(() => setMedia(null), []);

  // The overlay sits on top visually, but Lenis binds to the scroll
  // container regardless, so without this the page behind it still scrolls.
  useScrollLock(!!media);

  // Escape to close, and move focus to the close button so keyboard users
  // land inside the dialog immediately — restoring focus to whichever
  // figure/poster button opened it on close.
  useEffect(() => {
    if (!media) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, [media, close]);

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

  return (
    <LightboxContext.Provider value={{ open }}>
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

// Small "click to enlarge" affordance shown on hover/focus of a clickable
// media tile — reuses the same reveal-on-hover vocabulary as the project
// card's "View project →" hint elsewhere on the site.
export function ExpandHint() {
  return (
    <span className="media-expand-hint" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
