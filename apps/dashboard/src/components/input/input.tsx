import { forwardRef, InputHTMLAttributes } from "react";
import { InputError } from "./input-error";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  error?: string;
  className?: string;
  inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", inputClassName = "", ...props }, ref) => {
    return (
      <div className={className}>
        <input
          ref={ref}
          className={`
            w-full bg-neutral-900/50 border rounded-md px-3 py-2 text-white 
            placeholder-neutral-400 focus:outline-none focus:ring-2 
            transition-colors duration-200
            ${
              error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-neutral-600 focus:ring-indigo-500 focus:border-indigo-500"
            }
            ${inputClassName}
          `}
          {...props}
        />
        <InputError>{error}</InputError>
      </div>
    );
  }
);

Input.displayName = "Input";
