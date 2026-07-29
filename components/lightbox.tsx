"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type LightboxMedia = { src: string; isVideo: boolean };
type LightboxContextValue = { open: (src: string, isVideo?: boolean) => void };

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox(): LightboxContextValue {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within a LightboxProvider");
  return ctx;
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [media, setMedia] = useState<LightboxMedia | null>(null);

  const open = useCallback(
    (src: string, isVideo = false) => setMedia({ src, isVideo }),
    []
  );
  const close = useCallback(() => setMedia(null), []);

  useEffect(() => {
    if (!media) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [media, close]);

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      {media && (
        <div className="lightbox-overlay" role="dialog" aria-modal="true" onClick={close}>
          {media.isVideo ? (
            <video
              src={media.src}
              controls
              autoPlay
              loop
              muted
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={media.src} alt="" onClick={(e) => e.stopPropagation()} />
          )}
          <button type="button" className="lightbox-close" aria-label="Close" onClick={close}>
            ×
          </button>
        </div>
      )}
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
