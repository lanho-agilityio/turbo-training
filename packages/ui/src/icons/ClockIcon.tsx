import { CustomClassType } from "@repo/ui/types/components";

export const ClockIcon = ({ customClass = "w-2.5 h-2.5" }: CustomClassType) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    className={customClass}
  >
    <path
      d="M5.59998 4V6L6.84998 7.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.09998 1.66901C3.85974 1.22946 4.72223 0.998653 5.59998 1.00001C8.36148 1.00001 10.6 3.23851 10.6 6.00001C10.6 8.76151 8.36148 11 5.59998 11C2.83848 11 0.599976 8.76151 0.599976 6.00001C0.599976 5.08951 0.843476 4.23501 1.26898 3.50001"
      strokeLinecap="round"
    />
  </svg>
);
