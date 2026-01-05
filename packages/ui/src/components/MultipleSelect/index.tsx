"use client";

import { RefObject, useState } from "react";

// Icons
import { RxCross2 } from "react-icons/rx";
import { FilterIcon } from "@repo/ui/icons/FilterIcon";

// Utils
import { cn } from "@repo/ui/utils/styles";

// Hooks
import { useOutsideClick } from "@repo/ui/hooks/useOutsideClick";

// Types
import type { OptionType } from "@repo/ui/types/components";

// icons
import { GoChevronDown } from "react-icons/go";

type MultipleSelectProps = {
  title?: string;
  disabled?: boolean;
  options: OptionType[];
  selectedOptions?: string[];
  customClass?: {
    wrapper?: string;
    dropdown?: string;
  };
  onChange: (ids: string[]) => void;
  onBlur?: () => void;
};

export const MultipleSelect = ({
  title,
  options,
  selectedOptions = [],
  disabled = false,
  customClass,
  onChange,
  onBlur,
}: MultipleSelectProps) => {
  const [isOpenOptions, setIsOpenOptions] = useState(false);
  const [selectedData, setSelectedData] = useState<string[]>(selectedOptions);

  const handleSelect = (id: string) => {
    const newValue = [...selectedData, id];
    setSelectedData(newValue);
  };

  const handleRemove = (id: string) => {
    const newValue = [...selectedData.filter((it) => it !== id)];
    setSelectedData(newValue);
  };

  const filteredOptions = options.filter(
    (item) => !selectedData.includes(item.value!)
  );

  const filteredSelectedOptions = options.filter((item) =>
    selectedData.includes(item.value)
  );

  const showOptions = () => {
    !disabled && setIsOpenOptions(true);
  };

  const dropdownRef = useOutsideClick(() => {
    setIsOpenOptions(false);
    isOpenOptions && onChange(selectedData);
    isOpenOptions && onBlur?.();
  });

  return (
    <>
      <div
        className={cn(
          "h-fit rounded-lg border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 hover:cursor-pointer text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-white dark:text-white dark:bg-neutral-900 dark:border-gray-700",
          {
            "outline outline-1 outline-zinc-300 dark:outline-gray-800":
              isOpenOptions,
            "cursor-not-allowed": disabled,
            "w-fit": title,
          },
          customClass?.wrapper
        )}
        tabIndex={0}
        onClick={showOptions}
        onBlur={onBlur}
        ref={dropdownRef as RefObject<HTMLDivElement>}
        data-testid="multiple-select"
      >
        {filteredSelectedOptions.length > 0 && (
          <div className="bg-transparent flex w-full px-2">
            <div
              data-testid="selected-options-wrapper"
              className={cn(
                "w-full flex flex-wrap	gap-2",
                title ? "py-[5px]" : "py-[14px]"
              )}
            >
              {filteredSelectedOptions.map(({ value, name }: OptionType) => (
                <span
                  key={value}
                  className={`flex items-center border border-zinc-300 rounded-lg bg-gray-200 py-1 px-1 text-sm dark:text-white dark:bg-neutral-700 sm:p-2`}
                >
                  {name}
                  <button
                    name="members"
                    aria-label={`multiple-select-${value}`}
                    className="ml-2 pl-2 border-l border-zinc-300 cursor-pointer dark:border-white disabled:cursor-not-allowed"
                    onClick={() => handleRemove(value!)}
                    data-testid={`multiple-select-${value}`}
                    disabled={disabled}
                  >
                    <RxCross2 />
                  </button>
                </span>
              ))}
            </div>
            {filteredSelectedOptions.length !== options.length && (
              <div className="flex items-center ml-1.5">
                <GoChevronDown
                  className={cn(
                    "h-5 w-5 text-neutral-900 dark:text-white transform duration-300 ease-in-out",
                    {
                      "rotate-180": isOpenOptions,
                    }
                  )}
                />
              </div>
            )}
          </div>
        )}

        <div className="relative w-full focus:outline-2 focus:outline-blue-500 focus:border-none">
          {filteredSelectedOptions.length === 0 &&
            (title ? (
              <div className="flex items-center py-3 px-5 gap-3 justify-between">
                <div className="flex gap-2 items-center">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <FilterIcon />
                  </div>
                  <p className="text-black dark:text-white">{title}</p>
                </div>
                <div className="w-5 h-5 flex items-center justify-center">
                  <GoChevronDown
                    className={cn(
                      "h-6 w-6 text-neutral-900 dark:text-white transform duration-300 ease-in-out",
                      {
                        "rotate-180": isOpenOptions,
                      }
                    )}
                  />
                </div>
              </div>
            ) : (
              <p className="p-5 opacity-70">Select options</p>
            ))}
          {isOpenOptions && filteredOptions.length > 0 && (
            <div
              className={cn(
                "absolute z-10 w-full mt-2 p-2 bg-zinc-50 dark:bg-neutral-900 rounded-lg border border-zinc-300 dark:border-gray-700 outline outline-zinc-300 dark:outline-gray-700 overflow-y-auto max-h-48",
                customClass?.dropdown
              )}
              data-testid="options"
            >
              {filteredOptions.map(({ value, name }: OptionType) => (
                <div
                  key={value}
                  onClick={() => handleSelect(value!)}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-200 hover:rounded cursor-pointer dark:hover:bg-neutral-800"
                  data-testid={`option-${value}`}
                >
                  <span>{name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
