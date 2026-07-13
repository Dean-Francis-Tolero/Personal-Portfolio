// components/page_transition.tsx
"use client";

import { motion } from "framer-motion";
import { TransitionRouter, useTransitionState } from "next-transition-router";

// 1. The actual animation component
function TransitionOverlay({ children }: { children: React.ReactNode }) {
  const { stage } = useTransitionState();

  return (
    <div className="w-full h-full relative bg-[#f2f0ef]">
      {/* The current page stays frozen here while the black panel moves */}
      <div className="w-full h-full">
        {children}
      </div>

      <motion.div
        initial={{ y: "100%" }}
        animate={
          stage === "leaving" ? { y: "0%" } :
          stage === "entering" ? { y: "-100%" } :
          { y: "100%" }
        }
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-50 bg-black pointer-events-none"
      />
    </div>
  );
}

// 2. The default export that wraps the animation in the router logic
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <TransitionRouter 
      auto={true} 
      leave={(next) => {
        setTimeout(next, 800);}}
    >
      <TransitionOverlay>
        {children}
      </TransitionOverlay>
    </TransitionRouter>
  );
}