import { CustomClassType } from "@repo/ui/types/components";

export const SelectIcon = ({
  customClass = "w-2.5 h-1.5",
}: CustomClassType) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    className={customClass}
  >
    <path d="M.833.333 5 4.5 9.167.333H.833Z" />
  </svg>
);
