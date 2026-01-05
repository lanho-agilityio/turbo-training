import { CustomClassType } from "@repo/ui/types/components";

export const UserIcon = ({ customClass = "w-2.5 h-2.5" }: CustomClassType) => (
  <svg
    viewBox="0 0 16 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    className={customClass}
  >
    <path
      d="M7.99996 7.83335C9.84091 7.83335 11.3333 6.34097 11.3333 4.50002C11.3333 2.65907 9.84091 1.16669 7.99996 1.16669C6.15901 1.16669 4.66663 2.65907 4.66663 4.50002C4.66663 6.34097 6.15901 7.83335 7.99996 7.83335Z"
      strokeWidth="1.5"
    />
    <path
      d="M14.665 14.5C14.6666 14.3634 14.6666 14.2242 14.6666 14.0834C14.6666 12.0125 11.6816 10.3334 7.99998 10.3334C4.31831 10.3334 1.33331 12.0125 1.33331 14.0834C1.33331 16.1542 1.33331 17.8334 7.99998 17.8334C9.85915 17.8334 11.2 17.7025 12.1666 17.4692"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
