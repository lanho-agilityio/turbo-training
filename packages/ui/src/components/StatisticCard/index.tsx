import { ReactNode } from "react";
import Link from "next/link";

// Types
import type { VariantType } from "@repo/ui/types/variants";

// Utils
import { cn } from "@repo/ui/utils/styles";

type StatisticCardProps = {
  path: string;
  icon: ReactNode;
  label: string;
  description: string;
  variant?: VariantType;
  customClass?: {
    wrapper?: string;
    icon?: string;
    title?: string;
    desciption?: string;
  };
};

export const StatisticCard = ({
  path,
  icon,
  label,
  description,
  variant = "primary",
  customClass,
}: StatisticCardProps) => {
  return (
    <Link
      href={path}
      className="rounded-lg hover:outline outline-blue-400 dark:outline-white hover:outline-offset-2 hover:outline-2"
    >
      <div
        data-testid="statisticCard"
        className={cn(
          "flex flex-col rounded-lg pl-[12.5px] pr-[21.5px] py-[11px]",
          {
            "bg-orange-200": variant === "primary",
            "bg-indigo-100": variant === "secondary",
            "bg-violet-200": variant === "tertiary",
            "bg-yellow-100": variant === "warning",
            "bg-rose-200": variant === "error",
            "bg-lime-100": variant === "success",
          },
          customClass?.wrapper
        )}
      >
        <div
          data-testid="icon-wrapper"
          className={cn(
            "rounded-full w-fit p-2 mb-[15px] text-white",
            {
              "bg-orange-400": variant === "primary",
              "bg-indigo-500": variant === "secondary",
              "bg-fuchsia-700": variant === "tertiary",
              "bg-amber-300": variant === "warning",
              "bg-red-500": variant === "error",
              "bg-lime-500": variant === "success",
            },
            customClass?.icon
          )}
        >
          {icon}
        </div>
        <h1
          data-testid="title-text"
          className={cn("text-sm text-zinc-600 truncate", customClass?.title)}
        >
          {label}
        </h1>
        <span
          data-testid="description-text"
          className={cn(
            "text-neutral-800 font-bold text-[24px] truncate",
            customClass?.desciption
          )}
        >
          {description}
        </span>
      </div>
    </Link>
  );
};
