"use client";

import React, { useState, useEffect } from "react";
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
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-6 py-4 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
      } ${className}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.nav>
  );
};

const Left = ({ children, className = "" }: NavbarSectionProps) => {
  return (
    <div className={`flex items-center justify-start flex-1 ${className}`}>
      {children}
    </div>
  );
};

const Center = ({ children, className = "" }: NavbarSectionProps) => {
  return (
    <div className={`flex items-center justify-center flex-1 ${className}`}>
      {children}
    </div>
  );
};

const Right = ({ children, className = "" }: NavbarSectionProps) => {
  return (
    <div className={`flex items-center justify-end flex-1 ${className}`}>
      {children}
    </div>
  );
};

Navbar.Left = Left;
Navbar.Center = Center;
Navbar.Right = Right;

export { Navbar };
