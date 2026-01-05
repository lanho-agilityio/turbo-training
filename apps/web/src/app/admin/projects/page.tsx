import { Suspense } from 'react';

// Icons
import { FaPlus } from 'react-icons/fa';

// Components
import { NavLink } from '@repo/ui/components/NavLink';
import { ProjectPageSkeleton } from '@repo/ui/components/Skeleton';
import { ProjectTable } from '@/ui/project/ProjectTable';

// Constants
import { ROUTES } from '@repo/ui/constants/routes';

// Types
import { SearchParams } from '@repo/ui/types/query-params';

const ProjectListPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const queryParams = await searchParams;

  return (
    <main className="bg-white dark:bg-neutral-900 p-4 h-full">
      <div className="flex flex-row justify-between items-center py-8 ">
        <div className=" dark:text-white ">
          <h1 className="font-bold text-3xl">Projects</h1>
        </div>
        <NavLink
          href={ROUTES.ADMIN_PROJECT_UPSERT()}
          label="Create New Project"
          icon={<FaPlus />}
          className="bg-neutral-800 text-white font-bold py-3"
        />
      </div>
      <Suspense fallback={<ProjectPageSkeleton />}>
        <ProjectTable searchParams={queryParams} />
      </Suspense>
    </main>
  );
};

export default ProjectListPage;
