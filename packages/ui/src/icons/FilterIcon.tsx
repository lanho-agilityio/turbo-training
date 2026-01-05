import { CustomClassType } from "@repo/ui/types/components";

export const FilterIcon = ({
  customClass = "w-5 h-3 fill-black-500",
}: CustomClassType) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    className={customClass}
  >
    <path d="M18.438 2.563H1.563a.937.937 0 1 1 0-1.876h16.875a.938.938 0 0 1 0 1.875Zm-3.125 4.374H4.687a.937.937 0 1 1 0-1.875h10.625a.937.937 0 0 1 0 1.875Zm-3.75 4.375H8.437a.938.938 0 0 1 0-1.874h3.126a.937.937 0 0 1 0 1.874Z" />
  </svg>
);
