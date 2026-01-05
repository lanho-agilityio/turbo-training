import type { ReactNode } from 'react';
import clsx from 'clsx';

type BadgeProps = {
  label: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'warning'
    | 'error'
    | 'success';
  icon?: ReactNode;
  customClass?: string;
};

export const Badge = ({
  label,
  variant = 'primary',
  icon,
  customClass,
}: BadgeProps) => {
  const baseClass = 'w-fit flex items-center gap-2 px-2 py-1';

  return (
    <div
      className={clsx(
        baseClass,
        {
          'bg-blue-950': variant === 'primary',
          'bg-indigo-500': variant === 'secondary',
          'bg-purple-500': variant === 'tertiary',
          'bg-amber-400': variant === 'warning',
          'bg-red-400 dark:bg-red-600': variant === 'error',
          'bg-emerald-400 dark:bg-emerald-700': variant === 'success',
        },
        customClass,
      )}
    >
      {icon}
      {label}
    </div>
  );
};
