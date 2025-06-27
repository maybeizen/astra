import { ReactNode } from "react";

interface InputLabelProps {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

export function InputLabel({
  children,
  htmlFor,
  required = false,
  className = "",
}: InputLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-neutral-300 mb-2 ${className}`}
    >
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
}
