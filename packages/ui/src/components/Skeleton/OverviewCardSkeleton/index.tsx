// Utils
import { cn } from "@repo/ui/utils/styles";

type OverviewCardSkeletonProps = {
  isRowDisplay?: boolean;
  customClass?: {
    wrapper?: string;
    image?: string;
    content?: string;
  };
};

export const OverviewCardSkeleton = ({
  isRowDisplay = false,
  customClass,
}: OverviewCardSkeletonProps) => (
  <div
    className={cn(
      "animate-pulse flex flex-col border rounded-lg p-5 dark:bg-zinc-800 dark:border-gray-700 gap-2",
      isRowDisplay && "md:flex-row md:gap-4",
      customClass?.wrapper
    )}
  >
    <div
      className={cn(
        "rounded-lg bg-gray-200 dark:bg-gray-700",
        isRowDisplay && "flex-1 md:basis-2/5",
        customClass?.image
      )}
    />
    <div
      className={cn(
        "animate-pulse flex flex-col gap-1 dark:text-white min-w-0",
        isRowDisplay && "md:flex-1 md:basis-3/5",
        customClass?.content
      )}
    >
      <div className="h-5 bg-gray-200 rounded-lg dark:bg-gray-700 w-full" />
      <div className="h-5 bg-gray-200 rounded-lg dark:bg-gray-700 w-full" />
    </div>
  </div>
);
