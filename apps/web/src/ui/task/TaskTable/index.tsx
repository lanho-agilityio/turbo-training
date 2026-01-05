import { Suspense } from 'react';
import Link from 'next/link';
import { Session } from 'next-auth';

// Auths
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

// APIs
import { getProjectList } from '@/api/projects';
import { getTasks } from '@/api/tasks';

// Components
import { ErrorMessage } from '@repo/ui/components/ErrorMessage';
import { ItemNotFound } from '@repo/ui/components/ItemNotFound';
import { PaginationWrapper } from '@repo/ui/components/Pagination';
import { TableSkeleton } from '@repo/ui/components/Skeleton';
import { FilterWrapper } from '../FilterWrapper';
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
import {
  TASK_STATUS_VALUE,
  TASK_PRIORITY_VALUE,
} from '@repo/ui/constants/tasks';

// Icons
import { MdArrowRightAlt } from 'react-icons/md';

// Models
import { Task } from '@repo/db/models/tasks';

// Types
import { QueryFilter, SearchParams } from '@repo/ui/types/query-params';
import { VariantType } from '@repo/ui/types/variants';

// Utils
import { formatDate } from '@repo/ui/utils/dates';
import { cn } from '@repo/ui/utils/styles';

interface TaskTableProps {
  searchParams: SearchParams & {
    status?: TASK_STATUS_VALUE;
    priority?: TASK_PRIORITY_VALUE;
    projectId?: string;
    filterByUser?: string;
  };
}

const labelMapping = {
  [TASK_STATUS_VALUE.NOT_STARTED]: {
    value: 'Not Started',
    variant: 'primary',
  },
  [TASK_STATUS_VALUE.IN_PROGRESS]: {
    value: 'In Progress',
    variant: 'secondary',
  },
  [TASK_STATUS_VALUE.DONE]: {
    value: 'Done',
    variant: 'success',
  },
  [TASK_PRIORITY_VALUE.LOW]: {
    value: 'Low',
    variant: 'quaternary',
  },
  [TASK_PRIORITY_VALUE.MEDIUM]: {
    value: 'Medium',
    variant: 'active',
  },
  [TASK_PRIORITY_VALUE.HIGH]: {
    value: 'High',
    variant: 'error',
  },
};

const TableComponent = async ({
  session,
  taskListData,
  error,
}: {
  session: Session | null;
  taskListData: Task[];
  error?: string;
}) => {
  if (error) return <ErrorMessage message={error} />;

  if (taskListData.length === 0) {
    return (
      <ItemNotFound
        title="Empty Tasks"
        description="Your task are currently empty. Please create new task or stay tuned for updates"
      />
    );
  }

  return (
    <>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs uppercase text-gray-700 bg-gray-50 dark:bg-zinc-700 dark:text-gray-300">
          <tr className="font-bold">
            <th className="px-6 py-4">Task Name</th>
            <th className="px-6 hidden sm:block mt-3.5">Description</th>
            <th className="px-2 sm:px-6">Status</th>
            <th className="px-2">Date</th>
            <th className="px-2">Priority</th>
            <th className="w-6" />
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-800">
          {taskListData.map((task, index) => {
            const { value: statusValue, variant: statusVariant } =
              labelMapping[task.status];
            const { value: priorityValue, variant: priorityVariant } =
              labelMapping[task.priority];
            return (
              <tr
                key={task.id}
                className={cn(
                  'border-b-2 px-8 py-5 rounded-lg hover:bg-zinc-300 dark:hover:bg-gray-700 text-sm',
                  {
                    'border-t-2': index === 0,
                  },
                )}
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap w-full max-w-0 xl:w-auto">
                  <Link
                    href={
                      session
                        ? ROUTES.ADMIN_TASK_DETAIL(task.id)
                        : ROUTES.TASK_DETAIL(`${task.slug}-${task.id}`)
                    }
                  >
                    <p className="truncate">{task.title}</p>
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium whitespace-nowrap w-full max-w-0 min-w-[200px] hidden sm:block md:min-w-full">
                  <p className="truncate">{task.description}</p>
                </td>
                <td className="min-w-20 sm:min-w-28 px-2 sm:pr-2 sm:pl-6 py-4">
                  <Text
                    value={statusValue}
                    variant={statusVariant as VariantType}
                    customClass="font-medium px-0"
                  />
                </td>
                <td>
                  <p className="text-gray-900 dark:text-white min-w-16 sm:min-w-28 pl-2">
                    {formatDate(task.createdAt, DATE_FORMAT.Secondary)}
                  </p>
                </td>
                <td className="px-2 py-4">
                  <Text
                    value={priorityValue}
                    variant={priorityVariant as VariantType}
                    customClass="font-medium px-0"
                  />
                </td>
                <td>
                  <Link
                    href={
                      session
                        ? ROUTES.ADMIN_TASK_DETAIL(task.id)
                        : ROUTES.TASK_DETAIL(`${task.slug}-${task.id}`)
                    }
                    aria-label="task-detail"
                    className="px-2 md:px-4 flex justify-end"
                  >
                    <MdArrowRightAlt className="w-6 h-6 text-gray-900 dark:text-white" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export const TaskTable = async ({ searchParams }: TaskTableProps) => {
  const session = await getServerSession(authOptions);
  const { page, sortBy, status, priority, projectId, filterByUser } =
    searchParams;

  const query: QueryFilter[] = [];

  if (status) {
    const statusFilterList = decodeURIComponent(status)?.split(',');

    query.push({
      field: QUERY_PARAMS.STATUS,
      comparison: 'in',
      value: statusFilterList,
    });
  }

  if (priority) {
    const priorityFilterList = decodeURIComponent(priority)?.split(',');

    query.push({
      field: QUERY_PARAMS.PRIORITY,
      comparison: 'in',
      value: priorityFilterList,
    });
  }

  if (projectId) {
    const projectIdFilterList = decodeURIComponent(projectId)?.split(',');

    query.push({
      field: QUERY_PARAMS.PROJECT_ID,
      comparison: 'in',
      value: projectIdFilterList,
    });
  }

  if (filterByUser && session) {
    query.push({
      field: QUERY_PARAMS.ASSIGNED_TO,
      comparison: '==',
      value: session.user.id,
    });
  }

  const { data: projectListData, error: projectListError } =
    await getProjectList({
      orderItem: {
        field: FIELDS.UPDATED_AT,
        type: ORDER_TYPES.DESC,
      },
      query: session
        ? []
        : [
            {
              field: QUERY_PARAMS.IS_PUBLIC,
              comparison: '==',
              value: true,
            },
          ],
    });

  const {
    data: taskListData,
    error: taskError,
    total,
  } = await getTasks({
    page: parseInt(page || '1'),
    limitItem: QUERY_LIMIT_ITEMS.DEFAULT,
    orderItem: {
      field: FIELDS.UPDATED_AT,
      type: sortBy || ORDER_TYPES.DESC,
    },
    query,
  });

  const error = projectListError || taskError;

  const renderPagination = () => {
    if (total) {
      return (
        <div className="mt-10 sm:mt-6 flex justify-end">
          <Suspense>
            <PaginationWrapper
              total={total}
              pageSize={QUERY_LIMIT_ITEMS.DEFAULT}
            />
          </Suspense>
        </div>
      );
    }
  };

  return (
    <div className="relative">
      <FilterWrapper
        showFilterCheckbox={!!session}
        showPriorityFilter
        showStatusFilter
        projectList={projectListData}
        checkboxLabel="My Task(s)"
      />
      <Suspense key={JSON.stringify(searchParams)} fallback={<TableSkeleton />}>
        <TableComponent
          session={session}
          taskListData={taskListData}
          error={error}
        />
      </Suspense>
      {renderPagination()}
    </div>
  );
};
