"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useReducedMotion, type Variants } from "motion/react";
import { CURTAIN_CONTENT_DELAY_S } from "./transition_timing";

const subscribeNoop = () => () => {};
function useMounted() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

// Shared entrance choreography for pages reached through the page-transition
// curtain (app/page.tsx, app/projects/page.tsx): children fade/rise in,
// staggered, starting once the curtain has fully revealed the page.
export function useCurtainEntranceVariants() {
  const systemReduceMotion = useReducedMotion();
  const mounted = useMounted();
  const reduceMotion = mounted && systemReduceMotion;

  return useMemo(() => {
    const container: Variants = {
      initial: {},
      animate: {
        transition: reduceMotion ? {} : { staggerChildren: 0.15, delayChildren: CURTAIN_CONTENT_DELAY_S },
      },
    };

    const fadeRise: Variants = {
      initial: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
      animate: {
        opacity: 1,
        y: 0,
        transition: reduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      },
    };

    return { container, fadeRise, reduceMotion };
  }, [reduceMotion]);
}
