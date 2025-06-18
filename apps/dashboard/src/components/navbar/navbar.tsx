"use client";

import React, { useState } from "react";

type NavbarProps = {
  children: React.ReactNode;
  className?: string;
};

type NavbarSectionProps = {
  children: React.ReactNode;
  className?: string;
};

const Navbar = ({ children, className = "" }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`w-full transition-all duration-300 ease-in-out ${
            isScrolled
              ? "mt-4 rounded-xl shadow-lg dark:border-gray-800 bg-neutral-900/30 backdrop-blur-lg"
              : "bg-transparent"
          }`}
        >
          <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            {children}
          </div>
        </div>
      </div>
    </nav>
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
