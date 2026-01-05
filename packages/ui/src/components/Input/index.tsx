import { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

type InputProps = {
  variant?: 'primary' | 'outline' | 'fill';
  value?: string;
  placeholder?: string;
  customClass?: string;
  disabled?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef(
  (
    {
      variant = 'primary',
      value = '',
      onChange,
      placeholder = 'Type here',
      disabled = false,
      customClass,
      type = 'text',
      ...props
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const baseClass =
      'p-4 border border-zinc-300 focus:outline focus:outline-zinc-300 rounded-lg w-full dark:border-gray-700 dark:focus:outline-gray-700 dark:focus:border-gray-700 disabled:cursor-not-allowed disabled:opacity-50';

    return (
      <input
        {...props}
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={clsx(
          baseClass,
          {
            'bg-zinc-50 text-zinc-700 dark:bg-zinc-900 dark:text-white':
              variant === 'primary',
            'bg-transparent text-zinc-500 dark:text-white':
              variant === 'outline',
            'bg-white text-neutral-800 dark:text-white dark:bg-neutral-900':
              variant === 'fill',
          },
          customClass,
        )}
        disabled={disabled}
      />
    );
  },
);

Input.displayName = 'Input';

export { Input };
