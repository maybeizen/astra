import { ReactNode } from "react";

interface InputErrorProps {
  children: ReactNode;
  className?: string;
}

export function InputError({ children, className = "" }: InputErrorProps) {
  if (!children) return null;

  return <p className={`text-sm text-red-400 mt-1 ${className}`}>{children}</p>;
}
