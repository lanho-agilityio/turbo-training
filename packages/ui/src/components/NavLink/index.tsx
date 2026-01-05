import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes, ReactNode } from "react";

// Utils
import { cn } from "@repo/ui/utils/styles";

interface NavLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>, LinkProps {
  href: string;
  label: string;
  isActive?: boolean;
  icon?: ReactNode;
}

export const NavLink = ({
  href,
  label,
  icon,
  isActive = false,
  ...rest
}: NavLinkProps) => {
  const baseClass =
    "flex gap-2 items-center py-2 px-4 rounded-lg text-zinc-500 fill-zinc-500 dark:text-white dark:fill-white";
  const hoverClass =
    "hover:bg-black hover:text-white hover:fill-white hover:font-bold";

  return (
    <Link
      {...rest}
      href={href}
      className={cn(
        baseClass,
        hoverClass,
        isActive && "bg-black font-bold text-white fill-white",
        rest.className
      )}
    >
      {icon}
      {label}
    </Link>
  );
};
