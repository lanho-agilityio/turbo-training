type TaskSectionSkeletonProps = {
  totalItems?: number;
};

export const TaskSectionSkeleton = ({
  totalItems = 2,
}: TaskSectionSkeletonProps) => (
  <div className="animate-pulse flex flex-col gap-4 pt-2">
    <div className="w-full h-10 bg-gray-200 rounded-lg dark:bg-gray-700" />
    <div className="flex flex-col gap-4 ">
      {[...Array(totalItems)].map((_, index) => (
        <div
          key={`overview-card-${index}`}
          className="animate-pulse flex flex-col border rounded-lg p-5 dark:bg-zinc-800 dark:border-gray-700 gap-2"
        >
          <div className="rounded-lg h-60 bg-gray-200 dark:bg-gray-700" />
          <div className="rounded-lg w-32 h-8 bg-gray-200 dark:bg-gray-700 my-2" />
          <div className="rounded-lg w-3/4 h-4 bg-gray-200 dark:bg-gray-700" />
          <div className="rounded-lg w-2/3 h-4 bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  </div>
);
