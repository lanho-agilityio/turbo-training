import type { ReactNode } from "react";

// Utils
import { cn } from "@repo/ui/utils/styles";

type TextProps = {
  value: string;
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "quaternary"
    | "warning"
    | "error"
    | "success"
    | "active";
  icon?: ReactNode;
  customClass?: string;
};

export const Text = ({
  value,
  variant = "primary",
  icon,
  customClass,
}: TextProps) => {
  const baseClass = "w-fit flex items-center gap-1 px-2 py-1";

  return (
    <div
      className={cn(
        baseClass,
        {
          "fill-black text-black dark:fill-white dark:text-white":
            variant === "primary",
          "fill-blue-950 text-blue-950 dark:fill-blue-300 dark:text-blue-300":
            variant === "secondary",
          "fill-indigo-500 text-indigo-500": variant === "tertiary",
          "fill-purple-600 text-purple-600 dark:fill-purple-300 dark:text-purple-300":
            variant === "quaternary",
          "fill-red-600 text-red-600 dark:fill-red-400 dark:text-red-400":
            variant === "error",
          "fill-sky-700 text-sky-700 dark:fill-sky-300 dark:text-sky-300":
            variant === "active",
          "fill-amber-400 text-amber-400": variant === "warning",
          "fill-green-700 text-green-700 dark:fill-green-300 dark:text-green-300":
            variant === "success",
        },
        customClass
      )}
    >
      {icon}
      {value}
    </div>
  );
};
