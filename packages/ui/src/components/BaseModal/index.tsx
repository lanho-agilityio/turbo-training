"use client";
import { Fragment, ReactNode, RefObject, useCallback, useEffect } from "react";

// Components
import { Button } from "@repo/ui/components/Button";
import { PortalModal } from "@repo/ui/components/PortalModal";

// Hooks
import { useOutsideClick } from "@repo/ui/hooks/useOutsideClick";

// Icons
import { RxCross2 } from "react-icons/rx";

// Utils
import { cn } from "@repo/ui/utils/styles";

type BaseModalProps = {
  children: ReactNode;
  isOpen: boolean;
  title?: string;
  wrapperId?: string;
  customClass?: {
    overlay?: string;
    modalWrappper?: string;
    title?: string;
    button?: string;
    content?: string;
  };
  onClose: (value: boolean) => void;
};

export const BaseModal = ({
  title,
  children,
  isOpen,
  wrapperId = "modal",
  customClass,
  onClose,
}: BaseModalProps) => {
  const handleClose = () => {
    onClose(false);
  };

  const handlePressEscape = useCallback(
    (event: KeyboardEvent) => {
      event.key === "Escape" && onClose(false);
    },
    [onClose]
  );

  const modalRef = useOutsideClick(handleClose);

  useEffect(() => {
    document.addEventListener("keydown", handlePressEscape);
    return () => {
      document.removeEventListener("keydown", handlePressEscape);
    };
  }, [handlePressEscape, isOpen]);

  return (
    <Fragment>
      {isOpen && (
        <PortalModal wrapperId={wrapperId}>
          <div
            data-testid="modal-overlay"
            className={cn(
              "w-full h-full z-1 top-0 left-0 fixed bg-zinc-100/70",
              customClass?.overlay
            )}
          >
            <div
              data-testid="modal"
              ref={modalRef as RefObject<HTMLDivElement>}
              className={cn(
                "w-full md:w-1/2 relative mx-auto top-20 border rounded-lg py-3 bg-white dark:bg-neutral-800",
                customClass?.modalWrappper
              )}
            >
              <div className="flex flex-row justify-between items-center py-4 px-6 border-b">
                <h1 className={cn("font-bold text-2xl", customClass?.title)}>
                  {title}
                </h1>
                <Button
                  dataTestId="close-button"
                  onClick={handleClose}
                  variant="outline"
                  customClass={cn(
                    "border-red-400 rounded-full p-1 w-6 h-6",
                    customClass?.button
                  )}
                >
                  <RxCross2 className="text-red-400 w-5 h-5" />
                </Button>
              </div>
              <div className={cn("px-5 pt-3", customClass?.content)}>
                {children}
              </div>
            </div>
          </div>
        </PortalModal>
      )}
    </Fragment>
  );
};
