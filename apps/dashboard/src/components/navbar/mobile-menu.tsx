"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type MobileMenuProps = {
  children: React.ReactNode;
  className?: string;
};

export const MobileMenu = ({ children, className = "" }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const itemVariants = {
    closed: {
      opacity: 0,
      y: -8,
      transition: { duration: 0.15 },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className={`relative z-50 ${className}`}>
      <button
        onClick={toggleMenu}
        aria-label="Toggle menu"
        className="relative w-10 h-10 flex items-center justify-center focus:outline-none"
      >
        <motion.span
          className="absolute w-6 h-0.5 bg-gray-800 dark:bg-gray-200"
          animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="absolute w-6 h-0.5 bg-gray-800 dark:bg-gray-200"
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.1 }}
        />
        <motion.span
          className="absolute w-6 h-0.5 bg-gray-800 dark:bg-gray-200"
          animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
          transition={{ duration: 0.2 }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              closed: {
                opacity: 0,
                height: 0,
                transition: {
                  duration: 0.25,
                  ease: "easeInOut",
                  when: "afterChildren",
                },
              },
              open: {
                opacity: 1,
                height: "auto",
                transition: {
                  duration: 0.25,
                  ease: "easeOut",
                  when: "beforeChildren",
                  staggerChildren: 0.05,
                },
              },
            }}
            className="absolute top-14 right-0 mx-auto px-4 py-4 bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-100 shadow-xl rounded-lg overflow-hidden"
          >
            {React.Children.map(children, (child, i) => (
              <motion.div key={i} variants={itemVariants} className="py-1">
                {child}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
