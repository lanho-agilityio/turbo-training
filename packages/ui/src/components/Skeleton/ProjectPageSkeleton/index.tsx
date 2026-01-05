// Constants
import { SKELETON_LIMIT_ITEMS } from "@repo/ui/constants/limitConstants";

// Utils
import { cn } from "@repo/ui/utils/styles";

export const ProjectPageSkeleton = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {[...Array(2)].map((_, index) => (
          <div
            key={`filter-${index}`}
            className="animate-pulse w-32 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"
          />
        ))}
      </div>
      <div className="w-full text-sm text-left text-gray-500">
        <div className="text-xs uppercase text-gray-700 bg-gray-50 dark:bg-zinc-700 dark:text-gray-300">
          <div className="animate-pulse h-12" />
          {[...Array(SKELETON_LIMIT_ITEMS.DEFAULT)].map((_, index) => (
            <div
              key={`overview-card-${index}`}
              className={cn(
                "animate-pulse flex flex-col border-b-2 p-4 bg-white dark:bg-zinc-800"
              )}
            >
              <div className="animate-pulse flex flex-1 flex-col gap-1 dark:text-white min-w-0">
                <div className="h-7 bg-gray-200 rounded-lg dark:bg-gray-700 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 sm:mt-6 flex justify-end gap-2">
        <div className="animate-pulse w-32 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="animate-pulse w-32 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </>
  );
};
