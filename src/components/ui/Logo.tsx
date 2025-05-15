"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <motion.svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-shrink-0"
      >
        {/* Hand-drawn top hat */}
        <path
          d="M6 22C6 22 7 18 8 16C9 14 11 12 16 12C21 12 23 14 24 16C25 18 26 22 26 22"
          stroke="#ff4444"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
        />
        <path
          d="M4 22H28"
          stroke="#ff4444"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 12C12 12 13 8 16 8C19 8 20 12 20 12"
          stroke="#ff4444"
          strokeWidth="2"
          strokeLinecap="round"
          fill="#ff2222"
          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
        />
      </motion.svg>
      <motion.span
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-100"
      >
        CaptureIt LS
      </motion.span>
    </Link>
  );
}
