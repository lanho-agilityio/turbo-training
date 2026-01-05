import { Suspense } from 'react';
import type { Metadata } from 'next';

// Constants
import { OPEN_GRAPH_IMAGE } from '@repo/ui/constants/images';
import { METADATA_CONTENT } from '@repo/ui/constants/metadata';
import { ROUTES } from '@repo/ui/constants/routes';

// Components
import {
  TaskListSkeleton,
  ProjectListSkeleton,
  RecentlyCreatedTaskListSkeleton,
} from '@repo/ui/components/Skeleton';
import { TaskList } from '@/ui/board/TaskList';
import { ProjectList } from '@/ui/board/ProjectList';
import { RecentlyCreatedTaskList } from '@/ui/board/RecentlyCreatedTaskList';

const BASE_URL = process.env.NEXT_PUBLIC_URL;

const { TITLE, DESC } = METADATA_CONTENT.BOARDS;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${BASE_URL}${ROUTES.BOARDS}`,
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

const BoardsPage = () => {
  return (
    <main className="pt-4">
      <div className="grid grid-cols-1 lg:grid-cols-8 md:gap-7">
        <div className="lg:col-span-6 flex flex-col gap-8">
          <Suspense fallback={<TaskListSkeleton />}>
            <TaskList />
          </Suspense>
          <Suspense fallback={<ProjectListSkeleton />}>
            <ProjectList />
          </Suspense>
        </div>
        <div className="lg:col-span-2 pt-8 md:pt-0">
          <Suspense fallback={<RecentlyCreatedTaskListSkeleton />}>
            <RecentlyCreatedTaskList />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default BoardsPage;
