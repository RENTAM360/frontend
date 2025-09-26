"use client"

import { motion } from "framer-motion"
import React from "react"

export function AnimatedLogo() {
  const draw = {
    hidden: { pathLength: 0, fill: "rgba(18, 183, 106, 0)" },
    visible: (custom: number) => ({
      pathLength: 1,
      fill: "rgba(18, 183, 106, 1)",
      transition: {
        pathLength: { delay: custom * 0.5, duration: 0.8 },
        fill: { delay: custom * 1, duration: 0.5 },
      },
    }),
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white">
      <motion.svg
        viewBox="0 0 321.32 299.9"
        xmlns="http://www.w3.org/2000/svg"
        className="w-40 h-40"
      >
        <motion.polygon
          points="171.37 0 171.37 85.69 114.24 139.35 116.69 56.11 13.53 57.13 71.4 0 171.37 0"
          stroke="#12b76a"
          strokeWidth={2}
          variants={draw}
          initial="hidden"
          animate="visible"
          custom={0} // Pass index for stagger
        />
        <motion.path
          d="M0,71.41h99.97v228.49h0C44.76,299.9,0,255.14,0,199.93V71.41Z"
          stroke="#12b76a"
          strokeWidth={2}
          variants={draw}
          initial="hidden"
          animate="visible"
          custom={0.8}
        />
        <motion.path
          d="M116.7,157.09l92.03,92.03c27.42,27.42,71.72,27.89,99.72,1.07l12.86-12.32L177.28,96.5l-60.59,60.59Z"
          stroke="#12b76a"
          strokeWidth={2}
          variants={draw}
          initial="hidden"
          animate="visible"
          custom={0.2}
        />
      </motion.svg>
    </div>
  )
}
