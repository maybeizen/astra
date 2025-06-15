import React from "react";

export const Container: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={`container bg-neutral-950 mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
};
