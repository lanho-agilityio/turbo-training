import { ChangeEventHandler } from "react";

// Icons
import { CiSearch } from "react-icons/ci";

// Components
import { Input } from "@repo/ui/components/Input";

type SearchInputProps = {
  value?: string;
  placeholder?: string;
  customClass?: string;
  disabled?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export const SearchInput = ({
  value = "",
  disabled = false,
  placeholder = "Search",
  onChange,
}: SearchInputProps) => (
  <div className="relative w-full">
    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
      <CiSearch className="h-6 w-6 text-slate-500" />
    </div>
    <Input
      value={value}
      onChange={onChange}
      variant="outline"
      customClass="ps-10"
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);
