// Constants
import { SKELETON_LIMIT_ITEMS } from "@repo/ui/constants/limitConstants";

// Utils
import { cn } from "@repo/ui/utils/styles";

type TableSkeletonProps = {
  totalItems?: number;
};

const TableRowSkeleton = () => (
  <div
    className={cn(
      "animate-pulse flex flex-col border-b-2 p-4 bg-white dark:bg-zinc-800"
    )}
  >
    <div className="animate-pulse flex flex-1 flex-col gap-1 dark:text-white min-w-0">
      <div className="h-7 bg-gray-200 rounded-lg dark:bg-gray-700 w-full" />
    </div>
  </div>
);

export const TableSkeleton = ({
  totalItems = SKELETON_LIMIT_ITEMS.DEFAULT,
}: TableSkeletonProps) => (
  <div>
    <div className="w-full text-sm text-left text-gray-500">
      <div className="text-xs uppercase text-gray-700 bg-gray-50 dark:bg-zinc-700 dark:text-gray-300">
        <div>
          <div className="animate-pulse h-12" />
          {[...Array(totalItems)].map((_, index) => (
            <TableRowSkeleton key={`overview-card-${index}`} />
          ))}
        </div>
      </div>
    </div>
  </div>
);
