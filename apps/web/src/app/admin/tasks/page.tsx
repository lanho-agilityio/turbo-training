import { Suspense } from 'react';

// Components
import { TaskTable } from '@/ui/task/TaskTable';
import { TableSkeleton } from '@repo/ui/components/Skeleton';

// Types
import type { SearchParams } from '@repo/ui/types/query-params';

const TaskListPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const queryParams = await searchParams;

  return (
    <main className="bg-white dark:bg-neutral-900 p-4 h-full">
      <div className="flex flex-row justify-between items-center py-8 ">
        <div className=" dark:text-white ">
          <h1 className="font-bold text-3xl dark:text-white">Tasks</h1>
        </div>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <TaskTable
          key={JSON.stringify(queryParams)}
          searchParams={queryParams}
        />
      </Suspense>
    </main>
  );
};

export default TaskListPage;
