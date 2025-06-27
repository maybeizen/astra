import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { InputError } from "./input-error";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> {
  label?: ReactNode;
  error?: string;
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      className = "",
      checkboxClassName = "",
      labelClassName = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={className}>
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input ref={ref} type="checkbox" className="sr-only" {...props} />
            <div
              className={`
              w-11 h-6 rounded-full transition-colors duration-200 relative
              ${props.checked ? "bg-indigo-500" : "bg-neutral-700"}
              ${error ? "bg-red-500" : ""}
              ${checkboxClassName}
            `}
            >
              <div
                className={`
                absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200
                ${props.checked ? "translate-x-5" : "translate-x-0"}
              `}
              />
            </div>
          </div>
          {label && (
            <span className={`text-sm text-neutral-300 ${labelClassName}`}>
              {label}
            </span>
          )}
        </label>
        <InputError>{error}</InputError>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
