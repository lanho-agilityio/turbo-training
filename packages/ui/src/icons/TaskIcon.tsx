import { CustomClassType } from "@repo/ui/types/components";

export const TaskIcon = ({ customClass = "w-2.5 h-2.5" }: CustomClassType) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    className={customClass}
  >
    <path
      d="M17 1H3C1.89543 1 1 1.89543 1 3V17C1 18.1046 1.89543 19 3 19H17C18.1046 19 19 18.1046 19 17V3C19 1.89543 18.1046 1 17 1Z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 6H14M6 10H12M9 14H14"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
