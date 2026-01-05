import { Suspense } from 'react';

// Components
import {
  ProjectListSkeleton,
  RecentlyCreatedTaskListSkeleton,
  TaskListSkeleton,
} from '@repo/ui/components/Skeleton';
import { TaskList } from '@/ui/board/TaskList';
import { ProjectList } from '@/ui/board/ProjectList';
import { RecentlyCreatedTaskList } from '@/ui/board/RecentlyCreatedTaskList';

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
