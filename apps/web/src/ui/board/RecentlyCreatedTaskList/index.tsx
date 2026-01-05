// APIs
import { getTasks } from '@/api/tasks';

// Auth
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

// Components
import { ErrorMessage } from '@repo/ui/components/ErrorMessage';
import { ItemNotFound } from '@repo/ui/components/ItemNotFound';
import { OverviewCard } from '@repo/ui/components/OverviewCard';

// Constants
import { DATE_FORMAT } from '@repo/ui/constants/dates';
import { QUERY_LIMIT_ITEMS } from '@repo/ui/constants/limitConstants';
import { ORDER_BY } from '@repo/ui/constants/queryParams';
import { ROUTES } from '@repo/ui/constants/routes';

// Types
import { Task } from '@repo/db/models/tasks';

// Utils
import { formatDate } from '@repo/ui/utils/dates';

const RecentlyCreatedTaskList = async () => {
  const session = await getServerSession(authOptions);
  const { data, error } = await getTasks({
    limitItem: QUERY_LIMIT_ITEMS.RECENT_TASKS,
    orderItem: { field: ORDER_BY.CREATED_AT, type: 'desc' },
  });

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (data.length == 0) {
    return (
      <ItemNotFound
        title="Empty Tasks"
        description="Your tasks are currently empty. Please create new tasks or stay tuned for updates"
        customClass={{
          wrapper: 'bg-white dark:bg-zinc-800 h-full rounded-lg p-10',
        }}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg h-full">
      <span className="text-xl font-bold dark:text-white">
        Recently Created Tasks
      </span>
      <div className="flex flex-col gap-4 pt-3">
        {data.map((task: Task) => {
          const { id, slug, createdAt, title, description, image } = task;

          return (
            <OverviewCard
              key={id}
              href={
                session
                  ? ROUTES.ADMIN_TASK_DETAIL(id)
                  : ROUTES.TASK_DETAIL(`${slug}-${id}`)
              }
              time={formatDate(createdAt, DATE_FORMAT.Hour)}
              title={title}
              description={description}
              isRowDisplay={true}
              imageSrc={image || '/image-not-available.webp'}
              customClass={{
                wrapper: 'hover:bg-zinc-100 dark:hover:bg-zinc-700',
                image: 'md:max-w-20 md:aspect-square',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export { RecentlyCreatedTaskList };
