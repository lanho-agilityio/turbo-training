import { Suspense } from 'react';
import type { Metadata } from 'next';

// Constants
import { OPEN_GRAPH_IMAGE } from '@repo/ui/constants/images';
import { METADATA_CONTENT } from '@repo/ui/constants/metadata';
import { ROUTES } from '@repo/ui/constants/routes';

// Components
import { TableSkeleton } from '@repo/ui/components/Skeleton';
import { TaskTable } from '@/ui/task/TaskTable';

// Types
import type { SearchParams } from '@repo/ui/types/query-params';

const BASE_URL = process.env.NEXT_PUBLIC_URL;

const { TITLE, DESC } = METADATA_CONTENT.TASK_LIST;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${BASE_URL}${ROUTES.TASK_LIST}`,
    images: [
      {
        url: OPEN_GRAPH_IMAGE,
        width: 1200,
        height: 630,
        alt: DESC,
      },
    ],
  },
};

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
        <TaskTable searchParams={queryParams} />
      </Suspense>
    </main>
  );
};

export default TaskListPage;
