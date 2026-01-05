import { ReactNode } from "react";

// Components
import { Button } from "@repo/ui/components/Button";

// Icons
import { RxCross2 } from "react-icons/rx";

// Types
import type { CustomClassType } from "@repo/ui/types/components";

// Utils
import { cn } from "@repo/ui/utils/styles";

export interface ToastProps extends CustomClassType {
  icon?: ReactNode;
  message: string;
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "warning"
    | "error"
    | "success";
  onClose?: () => void;
}

export const Toast = ({
  icon,
  message,
  variant = "success",
  onClose,
  customClass,
}: ToastProps) => {
  const baseClass =
    "fixed -translate-x-1/2 left-1/2 bottom-0 flex items-center justify-between w-full max-w-sm px-4 py-2 mb-4 rounded-lg z-10 text-white fill-white";
  return (
    <div
      className={cn(
        baseClass,
        {
          "bg-blue-950": variant === "primary",
          "bg-indigo-500": variant === "secondary",
          "bg-purple-500": variant === "tertiary",
          "bg-amber-400": variant === "warning",
          "bg-red-500": variant === "error",
          "bg-emerald-500": variant === "success",
        },
        customClass
      )}
      data-testid="toast"
    >
      <div className="flex items-center">
        {icon}
        <div className="ms-3 text-sm font-bold ">{message}</div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        customClass="border-none hover:bg-inherit"
      >
        <RxCross2 className="text-white w-5 h-5" />
      </Button>
    </div>
  );
};
