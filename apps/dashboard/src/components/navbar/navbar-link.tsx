"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

type NavbarLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
};

export const NavbarLink = ({
  href,
  children,
  className = "",
  activeClassName = "text-primary font-medium",
  exact = false,
}: NavbarLinkProps) => {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname.startsWith(href) && href !== "/";

  return (
    <Link href={href} passHref>
      <motion.span
        className={`relative inline-block px-4 py-2 text-sm transition-colors duration-200 cursor-pointer hover:text-primary ${className} ${
          isActive ? activeClassName : ""
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
        {isActive && (
          <motion.span
            className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"
            layoutId="navbar-indicator"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
      </motion.span>
    </Link>
  );
};
