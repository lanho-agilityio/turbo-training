import { CustomClassType } from "@repo/ui/types/components";

export const DotIcon = ({ customClass = "w-8 h-8" }: CustomClassType) => (
  <svg
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    className={customClass}
  >
    <path d="M7.8 10a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0-4.4 0z" />
  </svg>
);
