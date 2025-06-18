import { forwardRef, TextareaHTMLAttributes } from "react";
import { InputError } from "./input-error";

interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  error?: string;
  className?: string;
  textareaClassName?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error, className = "", textareaClassName = "", ...props }, ref) => {
    return (
      <div className={className}>
        <textarea
          ref={ref}
          className={`
            w-full bg-neutral-700/50 border rounded-md px-3 py-2 text-white 
            placeholder-neutral-400 focus:outline-none focus:ring-2 
            transition-colors duration-200 resize-vertical
            ${
              error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-neutral-600 focus:ring-indigo-500 focus:border-indigo-500"
            }
            ${textareaClassName}
          `}
          {...props}
        />
        <InputError>{error}</InputError>
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
