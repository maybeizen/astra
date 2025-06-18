"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";

type MobileMenuProps = {
  children: React.ReactNode;
  className?: string;
};

export const MobileMenu = ({ children, className = "" }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={`relative z-50 ${className}`}>
      <button
        onClick={toggleMenu}
        aria-label="Toggle menu"
        className="relative w-10 h-10 flex items-center justify-center focus:outline-none"
      >
        <span className="absolute w-6 h-0.5 bg-gray-800 dark:bg-gray-200" />
        <span className="absolute w-6 h-0.5 bg-gray-800 dark:bg-gray-200" />
        <span className="absolute w-6 h-0.5 bg-gray-800 dark:bg-gray-200" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="absolute top-14 right-0 mx-auto px-4 py-4 bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-100 shadow-xl rounded-lg overflow-hidden">
            {React.Children.map(children, (child, i) => (
              <div key={i} className="py-1">
                {child}
              </div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
