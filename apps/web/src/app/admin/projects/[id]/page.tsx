import { Suspense } from 'react';
// APIs
import { getProjectById } from '@/api/projects';

// Components
import { ErrorMessage } from '@repo/ui/components/ErrorMessage';
import { ItemNotFound } from '@repo/ui/components/ItemNotFound';
import {
  ProjectHeaderSkeleton,
  TaskSectionSkeleton,
} from '@repo/ui/components/Skeleton';
import { ProjectHeader } from '@/ui/project-detail/ProjectHeader';
import { TaskSection } from '@/ui/project-detail/TaskSection';

// Constants
import {
  TASK_PRIORITY_VALUE,
  TASK_STATUS_OPTIONS,
} from '@repo/ui/constants/tasks';

// Types
import type { SearchParams } from '@repo/ui/types/query-params';

const ProjectDetailPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<
    SearchParams & {
      priority?: TASK_PRIORITY_VALUE;
      userId?: string;
    }
  >;
}) => {
  const { id: projectId } = await params;
  const { sortBy, priority, userId } = await searchParams;

  const { data: projectData, error: projectError } =
    await getProjectById(projectId);

  if (projectError) {
    return <ErrorMessage message={projectError} />;
  }

  if (!projectData) {
    return (
      <ItemNotFound
        title="Project Not Found"
        description="Please create a new project or stay tuned for updates"
        customClass={{
          wrapper: ' rounded-lg px-5 bg-white  py-20',
        }}
      />
    );
  }

  return (
    <main className="grid grid-flow-row gap-3">
      <h1 className="font-bold text-3xl dark:text-white pb-[43px] pt-5">
        Project Board
      </h1>
      <Suspense fallback={<ProjectHeaderSkeleton />}>
        <ProjectHeader project={projectData} />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 md:divide-y-0">
        {TASK_STATUS_OPTIONS.map(({ name, value }) => (
          <Suspense fallback={<TaskSectionSkeleton />} key={`section-${name}`}>
            <TaskSection
              key={`section-${name}`}
              projectId={projectData.id}
              sortBy={sortBy}
              priority={priority}
              userId={userId}
              title={name}
              value={value}
              isShowCreateTask={!projectData.isArchived}
            />
          </Suspense>
        ))}
      </div>
    </main>
  );
};

export default ProjectDetailPage;
