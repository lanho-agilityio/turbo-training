"use client";

import { ReactNode, useState } from "react";

// Components
import { Toast, ToastProps } from "@repo/ui/components/Toast";

type ToastState = ToastProps & { isOpen: boolean };

export type TWithToast<T> = {
  openToast: (toast: ToastProps, callback?: () => void) => void;
} & T;

const defaultToast: ToastState = {
  isOpen: false,
  message: "",
  variant: "success",
};

export const withToast = <T,>(
  Child: (props: TWithToast<T>) => ReactNode,
  autoHideDuration = 3000
) => {
  const WithToastWrapper = (props: T) => {
    const [toast, setToast] = useState<ToastState>(defaultToast);

    const closeToast = () => {
      setToast(defaultToast);
    };

    const openToast = (
      { variant = "success", message, icon }: ToastProps,
      callback?: () => void
    ) => {
      setToast({ isOpen: true, variant, message, icon });

      setTimeout(() => {
        closeToast();
        callback?.();
      }, autoHideDuration);
    };

    const { isOpen, variant, message, icon } = toast;

    return (
      <>
        {isOpen && (
          <Toast
            icon={icon}
            message={message}
            variant={variant}
            onClose={closeToast}
          />
        )}
        <Child {...props} openToast={openToast} />
      </>
    );
  };

  return WithToastWrapper;
};
