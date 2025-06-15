"use client";

import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

type NavbarProps = {
  children: React.ReactNode;
  className?: string;
};

type NavbarSectionProps = {
  children: React.ReactNode;
  className?: string;
};

const Navbar = ({ children, className = "" }: NavbarProps) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 ${className}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className={`w-full transition-all duration-300 ease-in-out ${
            isScrolled
              ? "mt-4 rounded-xl shadow-lg dark:border-gray-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg"
              : "bg-transparent"
          }`}
        >
          <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            {children}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

const Left = ({ children, className = "" }: NavbarSectionProps) => (
  <div className={`flex items-center justify-start flex-1 ${className}`}>
    {children}
  </div>
);

const Center = ({ children, className = "" }: NavbarSectionProps) => (
  <div className={`flex items-center justify-center flex-1 ${className}`}>
    {children}
  </div>
);

const Right = ({ children, className = "" }: NavbarSectionProps) => (
  <div className={`flex items-center justify-end flex-1 ${className}`}>
    {children}
  </div>
);

Navbar.Left = Left;
Navbar.Center = Center;
Navbar.Right = Right;

export { Navbar };
