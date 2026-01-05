"use client";

import {
  ChangeEventHandler,
  ForwardedRef,
  InputHTMLAttributes,
  forwardRef,
  useState,
} from "react";

// Components
import { Input } from "@repo/ui/components/Input";

// Icons
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";

// Utils
import { cn } from "@repo/ui/utils/styles";

type InputPasswordProps = {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  customClass?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
} & InputHTMLAttributes<HTMLInputElement>;

const InputPassword = forwardRef(
  (
    {
      value,
      placeholder = "",
      disabled = false,
      customClass,
      onChange,
      ...props
    }: InputPasswordProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const baseClass =
      "p-4 border border-zinc-300 rounded-lg w-full dark:border-gray-700  bg-transparent text-zinc-500 dark:text-white";
    const disabledClass = "disabled:cursor-not-allowed disabled:opacity-50";
    const focusClass =
      "focus:outline focus:outline-zinc-300 dark:focus:outline-gray-700 dark:focus:border-gray-700";

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          customClass={cn(baseClass, disabledClass, focusClass, customClass)}
          disabled={disabled}
          data-testid="input-password"
        />
        {!disabled && (
          <div
            className="absolute inset-y-0 end-0 flex items-center pe-4 cursor-pointer"
            onClick={toggleShowPassword}
            data-testid="toggle-button"
          >
            {showPassword ? (
              <RiEyeOffFill
                className="h-6 w-6 text-slate-500"
                title="hide-password"
              />
            ) : (
              <RiEyeFill
                className="h-6 w-6 text-slate-500"
                title="show-password"
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

InputPassword.displayName = "InputPassword";

export { InputPassword };
