"use client";

import { motion, type Variants } from "motion/react";

const variants: Variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 1,
      ease: "circIn",
    },
  },
};

function BarLoader() {
  return (
    <motion.div
      transition={{
        staggerChildren: 0.25,
      }}
      initial="initial"
      animate="animate"
      className="flex gap-1"
    >
      <motion.div variants={variants} className="h-12 w-2 bg-black" />
      <motion.div variants={variants} className="h-12 w-2 bg-black" />
      <motion.div variants={variants} className="h-12 w-2 bg-black" />
      <motion.div variants={variants} className="h-12 w-2 bg-black" />
      <motion.div variants={variants} className="h-12 w-2 bg-black" />
    </motion.div>
  );
}

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex h-dvh w-full items-center justify-center bg-[#f2f0ef]">
      <BarLoader />
    </div>
  );
}