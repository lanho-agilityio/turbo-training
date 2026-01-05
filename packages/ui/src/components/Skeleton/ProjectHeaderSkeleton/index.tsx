export const ProjectHeaderSkeleton = () => (
  <>
    <div className="animate-pulse grid grid-rows-1 lg:grid-cols-5 px-7 py-14 bg-zinc-100 dark:bg-neutral-700 rounded-lg items-center lg:place-items-center gap-4 lg:min-h-40">
      <div className="w-full flex flex-col gap-2">
        <div className="h-4 lg:h-2 bg-gray-200 rounded-lg dark:bg-gray-700 w-2/3 lg:w-36" />
        <div className="h-4 lg:h-2 bg-gray-200 rounded-lg dark:bg-gray-600 w-1/2 lg:w-28" />
        <div className="h-2 bg-gray-200 rounded-lg dark:bg-gray-700 hidden lg:block w-32" />
        <div className="h-2 bg-gray-200 rounded-lg dark:bg-gray-600 hidden lg:block xl:hidden w-28" />
      </div>

      <div className="lg:col-span-2 flex w-full justify-start lg:justify-center gap-4">
        <div className="flex -space-x-4">
          <div className="h-12 w-12 bg-gray-300 rounded-full dark:bg-gray-700" />
          <div className="h-12 w-12 bg-gray-200 rounded-full dark:bg-gray-600" />
          <div className="h-12 w-12 bg-gray-300 rounded-full dark:bg-gray-700" />
        </div>

        <div className="h-12 w-32 bg-gray-200 rounded-lg dark:bg-gray-600" />
      </div>

      <div className="h-8 w-28 bg-gray-200 rounded-lg dark:bg-gray-700" />

      <div className="flex flex-col gap-4 dark:text-white">
        <div className="h-4 w-20 bg-gray-200 rounded-lg dark:bg-gray-600" />
        <div className="h-4 w-28 bg-gray-200 rounded-lg dark:bg-gray-700" />
      </div>
    </div>
    <div className="flex gap-5 flex-col-reverse md:flex-row justify-between mt-5 animate-pulse">
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="w-full md:w-48 h-12 bg-gray-200 rounded-lg dark:bg-gray-700" />
        <div className="w-full md:w-40 h-12 bg-gray-200 rounded-lg dark:bg-gray-700" />
        <div className="w-full md:w-28 h-12 bg-gray-200 rounded-lg dark:bg-gray-700" />
      </div>
      <div className="w-full flex flex-row gap-3 justify-end">
        <div className="w-40 h-12 bg-gray-200 rounded-lg dark:bg-gray-700 md:hidden" />
        <div className="w-20 h-12 bg-gray-200 rounded-lg dark:bg-gray-700" />
        <div className="w-24 h-12 bg-gray-200 rounded-lg dark:bg-gray-700" />
      </div>
    </div>
  </>
);
