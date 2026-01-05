import { Suspense } from 'react';

// Metadata
import { Metadata } from 'next';

// APIs
import { getProjectById } from '@/api/projects';

// Components
import { ProjectHeader } from '@/ui/project-detail/ProjectHeader';
import { TaskSection } from '@/ui/project-detail/TaskSection';
import { ErrorMessage } from '@repo/ui/components/ErrorMessage';
import { ItemNotFound } from '@repo/ui/components/ItemNotFound';
import {
  ProjectHeaderSkeleton,
  TaskSectionSkeleton,
} from '@repo/ui/components/Skeleton';

// Constants
import { OPEN_GRAPH_IMAGE } from '@repo/ui/constants/images';
import { ERROR_MESSAGES } from '@repo/ui/constants/messages';
import { ROUTES } from '@repo/ui/constants/routes';
import { TAGS } from '@repo/ui/constants/tags';
import {
  TASK_PRIORITY_VALUE,
  TASK_STATUS_OPTIONS,
} from '@repo/ui/constants/tasks';

// Types
import type { SearchParams } from '@repo/ui/types/query-params';

// Utils
import { getIdFromSlug } from '@repo/ui/utils/slugs';

type Props = {
  params: Promise<{ slug: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_URL;

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const projectId = slug ? getIdFromSlug(slug) : undefined;

  if (!projectId) {
    return {} as Metadata;
  }

  const { data: project } = await getProjectById(projectId);

  return {
    title: project?.title,
    description: project?.description,
    openGraph: {
      title: project?.title,
      description: project?.description,
      url: `${BASE_URL}${ROUTES.PROJECT_DETAIL(`${project?.slug}-${project?.id}`)}`,
      images: [
        {
          url: project?.image || OPEN_GRAPH_IMAGE,
          width: 1200,
          height: 630,
          alt: project?.description,
        },
      ],
    },
  };
};

const ProjectDetailPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; slug: string }>;
  searchParams: Promise<SearchParams & { priority?: TASK_PRIORITY_VALUE }>;
}) => {
  const { sortBy, priority } = await searchParams;
  const { slug } = await params;

  const projectId = slug ? getIdFromSlug(slug) : undefined;

  if (!projectId) {
    return null;
  }

  const { data: projectData, error: projectError } = await getProjectById(
    projectId,
    {
      options: { tags: [TAGS.PROJECT_DETAIL(`${slug}-${projectId}`)] },
    },
  );

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

  if (!projectData.isPublic) {
    return <ErrorMessage message={ERROR_MESSAGES.UNAUTHORIZED_ACCESS} />;
  }

  return (
    <main className="grid grid-flow-row gap-3">
      <h1 className="font-bold text-3xl dark:text-white pb-10.75 pt-5">
        Project Board
      </h1>
      <Suspense fallback={<ProjectHeaderSkeleton />}>
        <ProjectHeader project={projectData} />
      </Suspense>
      <div className="grid grid-rows-1 md:grid-cols-3 gap-6 pt-5 divide-y-2 md:divide-y-0">
        {TASK_STATUS_OPTIONS.map(({ name, value }) => (
          <Suspense fallback={<TaskSectionSkeleton />} key={`section-${name}`}>
            <TaskSection
              key={`section-${name}`}
              projectId={projectData.id}
              sortBy={sortBy}
              priority={priority}
              title={name}
              value={value}
            />
          </Suspense>
        ))}
      </div>
    </main>
  );
};

export default ProjectDetailPage;
