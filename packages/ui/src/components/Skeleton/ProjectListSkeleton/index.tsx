// Constants
import { SKELETON_LIMIT_ITEMS } from "@repo/ui/constants/limitConstants";

// Components
import { OverviewCardSkeleton } from "@repo/ui/components/Skeleton/OverviewCardSkeleton";

type ProjectListSkeletonProps = {
  totalItems?: number;
};

export const ProjectListSkeleton = ({
  totalItems = SKELETON_LIMIT_ITEMS.BOARD_PAGE,
}: ProjectListSkeletonProps) => (
  <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg">
    <div className="animate-pulse h-10 w-20 bg-gray-200 rounded-lg dark:bg-gray-700 mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 pt-3">
      {[...Array(totalItems)].map((_, index) => (
        <OverviewCardSkeleton
          key={`overview-card-${index}`}
          isRowDisplay={true}
          customClass={{
            image: "w-full h-full aspect-video md:aspect-square",
          }}
        />
      ))}
    </div>
  </div>
);
