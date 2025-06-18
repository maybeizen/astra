"use client";

import React, { useEffect, useRef, useState } from "react";

interface DropdownProps {
  label: string | React.ReactNode;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  className = "",
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        className="flex items-center justify-center"
        onClick={toggleDropdown}
      >
        {label}
      </button>

      <div
        className={`absolute right-0 mt-2 w-48 transform rounded border border-neutral-800 bg-neutral-900 text-white shadow-lg transition-all duration-200 ease-in-out ${
          isOpen
            ? "hover:none scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
