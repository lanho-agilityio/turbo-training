import { CustomClassType } from "@repo/ui/types/components";

export const AddIcon = ({ customClass = "w-2.5 h-2.5" }: CustomClassType) => (
  <svg
    className={customClass}
    stroke="currentColor"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 11H11M11 11H8M11 11V8.00001M11 11V14M6 2.33801C7.51952 1.45891 9.24451 0.997307 11 1.00001C16.523 1.00001 21 5.47701 21 11C21 16.523 16.523 21 11 21C5.477 21 1 16.523 1 11C1 9.17901 1.487 7.47001 2.338 6.00001"
      stroke="#262626"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
