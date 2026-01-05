"use client";
import { RefObject, useEffect, useRef, useState } from "react";

// Icons
import { GoChevronDown } from "react-icons/go";

// Components
import { Button } from "@repo/ui/components/Button";

// Hooks
import { useOutsideClick } from "@repo/ui/hooks/useOutsideClick";

// Utils
import { cn } from "@repo/ui/utils/styles";

// Types
import type { OptionType } from "@repo/ui/types/components";

type DropdownProps = {
  placeholder?: string;
  options: OptionType[];
  disabled?: boolean;
  selectedItemValue?: string;
  customClass?: {
    button?: string;
    placeholder?: string;
  };
  onSelect: (id: string) => void;
  onBlur?: () => void;
};

export const Dropdown = ({
  placeholder = "Dropdown",
  options = [],
  disabled = false,
  selectedItemValue,
  customClass,
  onSelect,
  onBlur,
}: DropdownProps) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const [selectedValue, setSelectedValue] = useState(selectedItemValue);

  const listRef = useRef<null | HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current && isOpenDropdown) {
      const targetIndex = options.findIndex(
        (item) => item.value === selectedValue
      );
      if (targetIndex !== -1) {
        const selectedOption = listRef.current?.children[targetIndex];
        if (selectedOption) {
          selectedOption.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    }
  }, [selectedValue, listRef, isOpenDropdown, options]);

  const handleToggleDropdown = () => {
    setIsOpenDropdown(!isOpenDropdown);
  };

  const handleChangeDropdown = (value: string) => {
    setSelectedValue(value);
    onSelect(value);
    setIsOpenDropdown(false);
    onBlur?.();
  };

  const renderTitle = () => {
    const selectedOption = options.find(({ value }) => value === selectedValue);

    return (
      <span className={cn(customClass?.placeholder)}>
        {selectedOption ? selectedOption.name : placeholder}
      </span>
    );
  };

  const dropdownRef = useOutsideClick(() => {
    setIsOpenDropdown(false);
  });

  return (
    <div
      ref={dropdownRef as RefObject<HTMLDivElement>}
      tabIndex={0}
      onBlur={onBlur}
    >
      <Button
        customClass={cn(
          "p-5 text-neutral-800 bg-zinc-50 hover:bg-zinc-100 dark:text-white dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white flex justify-between items-center gap-2 border border-zinc-300 dark:border-gray-700",
          !selectedValue && "text-zinc-400",
          customClass?.button,
          {
            "outline outline-1 outline-zinc-300 dark:outline-gray-700":
              isOpenDropdown,
            "cursor-not-allowed opacity-50 disabled:bg-zinc-50 disabled:opacity-50 dark:hover:opacity-50 dark:hover:bg-neutral-900 dark:disabled:bg-zinc-900":
              disabled,
          }
        )}
        disabled={disabled}
        onClick={handleToggleDropdown}
      >
        {renderTitle()}
        <GoChevronDown
          className={cn(
            "h-5.5 w-5.5 text-neutral-900 dark:text-white transform duration-300 ease-in-out",
            {
              "rotate-180": isOpenDropdown,
            }
          )}
        />
      </Button>
      {isOpenDropdown && (
        <div className="absolute z-20 p-2 mt-2 transform duration-300 ease-in-out bg-white dark:bg-zinc-900 text-neutral-800 dark:text-white overflow-y-auto max-h-40 rounded-lg border border-gray-200 dark:border-gray-700 outline outline-1 outline-zinc-300 dark:outline-gray-700">
          <ul
            data-testid="options"
            ref={listRef}
            className="flex flex-col gap-1.5"
          >
            {options.map((item) => {
              const { value, name } = item;

              return (
                <li
                  key={item.value}
                  className={cn(
                    "flex items-center cursor-pointer hover:bg-gray-200 p-3 rounded-md dark:hover:bg-neutral-800",
                    {
                      "bg-gray-300 dark:bg-neutral-700":
                        selectedValue === value,
                    }
                  )}
                  value={value}
                  onClick={() => handleChangeDropdown(value)}
                >
                  {name}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
