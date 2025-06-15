import React from "react";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonVariant =
  | "primary"
  | "secondary"
  | "glass"
  | "success"
  | "danger"
  | "ghost"
  | "outline";
type ButtonRounded = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full";
type IconPosition = "left" | "right";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  rounded?: ButtonRounded;
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: IconPosition;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  size = "md",
  variant = "primary",
  rounded = "md",
  fullWidth = false,
  icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  type = "button",
}) => {
  const sizeClasses = {
    xs: "text-xs px-2 py-1",
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-2.5",
    xl: "text-xl px-6 py-3",
  };

  const variantClasses = {
    primary: "bg-indigo-500 hover:bg-indigo-600 text-white",
    secondary: "bg-neutral-500 hover:bg-neutral-600 text-white",
    glass: "bg-white/10 backdrop-blur-md hover:bg-white/20 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    ghost: "bg-transparent hover:bg-indigo-500",
    outline: "bg-transparent border border-gray-300 hover:bg-gray-100",
  };

  const roundedClasses = {
    none: "rounded-none",
    xs: "rounded-sm",
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  const baseClasses =
    "font-medium transition-all duration-300 ease-in-out cursor-pointer";
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass =
    disabled || loading
      ? "opacity-70 scale-[0.98] shadow-inner"
      : "shadow-sm hover:shadow";
  const loadingClass = loading ? "relative animate-pulse-subtle" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${roundedClasses[rounded]}
        ${widthClass}
        ${disabledClass}
        ${loadingClass}
        ${className}
      `}
    >
      {loading ? (
        <>
          <span className="opacity-0 transition-opacity duration-300">
            {icon && iconPosition === "left" && (
              <i className={`${icon} mr-2`} />
            )}
            {children}
            {icon && iconPosition === "right" && (
              <i className={`${icon} ml-2`} />
            )}
          </span>
          <span className="absolute inset-0 flex items-center justify-center animate-fade-in">
            <i className="fa-solid fa-spinner-third animate-spin-clean" />
          </span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && <i className={`${icon} mr-2`} />}
          {children}
          {icon && iconPosition === "right" && <i className={`${icon} ml-2`} />}
        </>
      )}
    </button>
  );
};
