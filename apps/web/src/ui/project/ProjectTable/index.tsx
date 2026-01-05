import { Suspense } from 'react';
import Link from 'next/link';
import type { Session } from 'next-auth';

// Auths
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

// APIs
import { getProjectList } from '@/api/projects';

// Components
import { ErrorMessage } from '@repo/ui/components/ErrorMessage';
import { ItemNotFound } from '@repo/ui/components/ItemNotFound';
import { PaginationWrapper } from '@repo/ui/components/Pagination';
import { TableSkeleton } from '@repo/ui/components/Skeleton';
import { FilterWrapper } from '../../task/FilterWrapper';
import { Text } from '@repo/ui/components/Text';

// Constants
import { DATE_FORMAT } from '@repo/ui/constants/dates';
import { QUERY_LIMIT_ITEMS } from '@repo/ui/constants/limitConstants';
import {
  QUERY_PARAMS,
  FIELDS,
  ORDER_TYPES,
} from '@repo/ui/constants/queryParams';
import { ROUTES } from '@repo/ui/constants/routes';

// Icons
import { MdArrowRightAlt } from 'react-icons/md';

// Types
import type { Project } from '@repo/db/models/projects';
import type { QueryFilter, SearchParams } from '@repo/ui/types/query-params';

// Utils
import { formatDate } from '@repo/ui/utils/dates';
import { cn } from '@repo/ui/utils/styles';

const TableContent = async ({
  session,
  projectListData,
  error,
}: {
  session: Session | null;
  projectListData: Project[];
  error?: string;
}) => {
  if (error) return <ErrorMessage message={error} />;

  if (projectListData.length === 0) {
    return (
      <ItemNotFound
        title="Empty Tasks"
        description="Your task are currently empty. Please create new task or stay tuned for updates"
      />
    );
  }

  return (
    <table className="w-full text-sm text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-700 dark:text-gray-300">
        <tr>
          <th className="px-6 py-4">Project</th>
          <th className="px-6 py-4 hidden lg:block">Description</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4 hidden md:block">Create at</th>
          <th className="px-6 py-4">Last modified</th>
          <th className="w-6" />
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-zinc-800">
        {projectListData?.map((project, index) => (
          <tr
            key={project.id}
            className={cn(
              'border-b-2 rounded-lg hover:bg-zinc-300 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-white',
              {
                'border-t-2': index === 0,
              },
            )}
          >
            <td className="px-6 py-4 whitespace-nowrap max-w-0 w-auto">
              <Link
                href={
                  session
                    ? ROUTES.ADMIN_PROJECT_DETAIL(project.id)
                    : ROUTES.PROJECT_DETAIL(`${project.slug}-${project.id}`)
                }
                className="w-full flex items-center"
                aria-label={project.title}
              >
                <p className="truncate">{project.title}</p>
              </Link>
            </td>

            <td className="px-6 py-4 whitespace-nowrap w-full max-w-0 hidden lg:block md:min-w-full">
              <p className="truncate">{project.description}</p>
            </td>

            <td className="px-6 py-4 whitespace-nowrap max-w-0 w-auto">
              <div className="w-full capitalize">
                {project.isPublic ? 'public' : 'private'}
              </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap max-w-0 w-auto hidden md:block">
              <div className="w-full">
                <Text
                  customClass="px-0 text-gray-900 dark:text-white"
                  value={formatDate(project.createdAt, DATE_FORMAT.Secondary)}
                />
              </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap max-w-0 w-auto">
              <div className="w-full">
                <Text
                  customClass="px-0 text-gray-900 dark:text-white"
                  value={formatDate(project.updatedAt, DATE_FORMAT.Secondary)}
                />
              </div>
            </td>

            <td>
              <Link
                href={
                  session
                    ? ROUTES.ADMIN_PROJECT_DETAIL(project.id)
                    : ROUTES.PROJECT_DETAIL(`${project.slug}-${project.id}`)
                }
                aria-label="task-detail"
                className="px-2 md:px-4 flex justify-end"
              >
                <MdArrowRightAlt className="w-6 h-6 text-gray-900 dark:text-white" />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

type ProjectTableProps = {
  searchParams: SearchParams & { filterByUser?: string };
};

export const ProjectTable = async ({ searchParams }: ProjectTableProps) => {
  const session = await getServerSession(authOptions);
  const { page, sortBy, filterByUser } = searchParams;

  const query: QueryFilter[] = [];

  if (!session) {
    query.push({
      field: QUERY_PARAMS.IS_PUBLIC,
      comparison: '==',
      value: true,
    });
  }

  if (filterByUser) {
    query.push({
      field: QUERY_PARAMS.FILTER_BY_USER,
      comparison: '==',
      value: filterByUser,
    });
  }

  const { data, error, total } = await getProjectList({
    page: parseInt(page || '1'),
    limitItem: QUERY_LIMIT_ITEMS.DEFAULT,
    orderItem: {
      field: FIELDS.UPDATED_AT,
      type: sortBy || ORDER_TYPES.DESC,
    },
    query,
  });

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="relative overflow-x-auto">
      <FilterWrapper
        showFilterCheckbox={!!session}
        checkboxLabel="My Project(s)"
      />
      <Suspense key={JSON.stringify(searchParams)} fallback={<TableSkeleton />}>
        <TableContent session={session} projectListData={data} error={error} />
      </Suspense>
      <div className="mt-10 sm:mt-6 flex justify-end">
        {total && (
          <Suspense>
            <PaginationWrapper
              total={total}
              pageSize={QUERY_LIMIT_ITEMS.DEFAULT}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};
