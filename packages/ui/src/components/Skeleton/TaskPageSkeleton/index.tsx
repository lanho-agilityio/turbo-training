import { InputSkeleton } from "@repo/ui/components/Skeleton/InputSkeleton";

type TaskPageSkeleton = {
  isShowSkeletonButton?: boolean;
};

export const TaskPageSkeleton = ({
  isShowSkeletonButton = true,
}: TaskPageSkeleton) => (
  <main className="p-4 flex flex-col gap-8 pt-8 justify-items-stretch">
    <div className=" dark:text-white ">
      <h1 className="font-bold text-3xl">Tasks</h1>
    </div>
    <div className="w-full text-center py-4">
      <h1 className="animate-pulse font-bold text-3xl">Task</h1>
    </div>
    <div className="bg-white dark:bg-zinc-800 rounded-lg">
      <div className="w-full md:w-2/3 max-w-3xl p-10 mx-auto ">
        <div className="animate-pulse flex flex-col gap-4 dark:text-white">
          <InputSkeleton label="Project" />
          <InputSkeleton label="Title" />
          <InputSkeleton label="Slug" />
          <InputSkeleton label="Description" />
          <InputSkeleton label="Image" />
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <InputSkeleton label="Status" customClass="basis-1/2" />
            <InputSkeleton label="Priority" customClass="basis-1/2" />
          </div>
          <InputSkeleton label="Assigned To" />
          <InputSkeleton label="Due Date" />
          {isShowSkeletonButton && (
            <div className="h-[62px] bg-gray-200 rounded-lg dark:bg-gray-700 w-full mb-4" />
          )}
        </div>
      </div>
    </div>
  </main>
);
