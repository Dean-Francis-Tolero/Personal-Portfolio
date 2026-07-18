"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

const COUNT_DURATION = 1300;
const TICK_INTERVAL = 45;
const SETTLE_AT = 0.7;
const EXIT_DELAY = 150;

const curtain: Variants = {
  visible: { clipPath: "inset(0 0 0 0%)" },
  exit: {
    clipPath: "inset(0 0 0 100%)",
    transition: { duration: 0.7, ease: [0.83, 0, 0.17, 1] },
  },
};

export default function IntroLoader() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (sessionStorage.getItem("intro-shown")) return;

    if (reduceMotion) {
      sessionStorage.setItem("intro-shown", "1");
      return;
    }

    setVisible(true);
    const start = performance.now();

    const interval = setInterval(() => {
      const elapsed = performance.now() - start;
      const t = Math.min(elapsed / COUNT_DURATION, 1);

      if (t < SETTLE_AT) {
        const trend = (t / SETTLE_AT) * 70;
        setCount(Math.min(99, Math.floor(trend + Math.random() * 20)));
      } else {
        const settleT = (t - SETTLE_AT) / (1 - SETTLE_AT);
        setCount(Math.min(100, Math.floor(70 + settleT * 30)));
      }

      if (t >= 1) {
        clearInterval(interval);
        setCount(100);
        window.setTimeout(() => setExiting(true), EXIT_DELAY);
      }
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [reduceMotion]);

  if (!visible) return null;

  return (
    <motion.div
      variants={curtain}
      initial="visible"
      animate={exiting ? "exit" : "visible"}
      onAnimationComplete={(definition) => {
        if (definition === "exit") {
          sessionStorage.setItem("intro-shown", "1");
          setVisible(false);
        }
      }}
      className="fixed inset-0 z-[100] flex items-end bg-background px-6 pb-6"
    >
      <div className="flex flex-col gap-2">
        <span className="text-[72px] sm:text-[96px] font-bold tabular-nums leading-none">
          {String(count).padStart(2, "0")}
        </span>
        <div className="h-[1.5px] w-40 bg-foreground/15">
          <div className="h-full bg-foreground" style={{ width: `${count}%` }} />
        </div>
      </div>
    </motion.div>
  );
}
