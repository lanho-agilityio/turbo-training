"use client";

import { ForwardedRef, InputHTMLAttributes, forwardRef } from "react";

// Utils
import { cn } from "@repo/ui/utils/styles";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  customClass?: {
    label?: string;
    description?: string;
  };
}

const Checkbox = forwardRef(
  (
    { label, description, id, disabled, customClass, ...props }: CheckboxProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const componentId = `checkbox-${id}-${label}`;

    return (
      <div className="flex gap-3 h-12 min-w-40 items-center">
        <input
          {...props}
          ref={ref}
          className={cn(
            "accent-black dark:accent-white w-5 h-5 cursor-pointer disabled:cursor-not-allowed",
            props.className
          )}
          disabled={disabled}
          id={componentId}
          type="checkbox"
        />
        <div className="flex flex-col">
          <label
            className={cn(
              "text-neutral-800 dark:text-white font-bold text-sm cursor-pointer",
              disabled && "disabled:cursor-not-allowed",
              customClass?.label
            )}
            htmlFor={componentId}
          >
            {label}
          </label>
          {description && (
            <span
              className={cn(
                "text-zinc-500 dark:text-white text-xs",
                customClass?.description
              )}
            >
              {description}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
