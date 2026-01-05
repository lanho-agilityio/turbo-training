// Components
import { InputFieldSkeleton } from "@repo/ui/components/Skeleton/InputFieldSkeleton";

// Types
import type { CustomClassType } from "@repo/ui/types/components";

// Utils
import { cn } from "@repo/ui/utils/styles";

type InputSkeletonProps = {
  label: string;
} & CustomClassType;
export const InputSkeleton = ({ label, customClass }: InputSkeletonProps) => (
  <div className={cn("flex flex-col gap-2", customClass)}>
    <label className="font-bold text-md">{label}</label>
    <InputFieldSkeleton />
    <div />
  </div>
);
