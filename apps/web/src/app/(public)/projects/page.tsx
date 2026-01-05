import { Suspense } from 'react';
import { Metadata } from 'next';

// Constants
import { OPEN_GRAPH_IMAGE } from '@repo/ui/constants/images';
import { METADATA_CONTENT } from '@repo/ui/constants/metadata';
import { ROUTES } from '@repo/ui/constants/routes';

// Components
import { ProjectTable } from '@/ui/project/ProjectTable';
import { ProjectPageSkeleton } from '@repo/ui/components/Skeleton';

// Types
import type { SearchParams } from '@repo/ui/types/query-params';

const BASE_URL = process.env.NEXT_PUBLIC_URL;

const { TITLE, DESC } = METADATA_CONTENT.PROJECT_LIST;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${BASE_URL}${ROUTES.PROJECT_LIST}`,
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

const ProjectListPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams & { filterByUser?: string }>;
}) => {
  const queryParams = await searchParams;

  return (
    <main className="bg-white dark:bg-neutral-900 p-4 h-full">
      <div className="flex flex-row justify-between items-center py-8 ">
        <div className="">
          <h1 className="font-bold text-3xl">Projects</h1>
        </div>
      </div>
      <Suspense fallback={<ProjectPageSkeleton />}>
        <ProjectTable searchParams={queryParams} />
      </Suspense>
    </main>
  );
};

export default ProjectListPage;
