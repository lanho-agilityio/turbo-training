// APIs
import { getProjectList } from '@/api/projects';

// Auth
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

// Components
import { ErrorMessage } from '@repo/ui/components/ErrorMessage';
import { ItemNotFound } from '@repo/ui/components/ItemNotFound';
import { OverviewCard } from '@repo/ui/components/OverviewCard';

// Constants
import { QUERY_LIMIT_ITEMS } from '@repo/ui/constants/limitConstants';
import {
  QUERY_PARAMS,
  ORDER_BY,
  ORDER_TYPES,
} from '@repo/ui/constants/queryParams';
import { ROUTES } from '@repo/ui/constants/routes';

// Types
import type { QueryFilter } from '@repo/ui/types/query-params';

const ProjectList = async () => {
  const session = await getServerSession(authOptions);
  const query: QueryFilter[] = session
    ? [
        {
          field: QUERY_PARAMS.FILTER_BY_USER,
          comparison: '==',
          value: 'true',
        },
      ]
    : [
        {
          field: QUERY_PARAMS.IS_PUBLIC,
          comparison: '==',
          value: true,
        },
      ];

  const { data, error, total } = await getProjectList({
    limitItem: QUERY_LIMIT_ITEMS.BOARD_PAGE,
    orderItem: { field: ORDER_BY.UPDATED_AT, type: ORDER_TYPES.DESC },
    query,
  });

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (data.length == 0) {
    return (
      <ItemNotFound
        title="Empty Projects"
        description="Your projects are currently empty. Please create new projects or stay tuned for updates"
        customClass={{
          wrapper: 'bg-white dark:bg-zinc-800 p-10 rounded-lg h-full',
        }}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg h-full">
      <span className="text-xl font-bold dark:text-white">
        {session ? 'My' : 'All'} Projects ({total})
      </span>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-3 gap-6 ">
        {data.map((project) => {
          const { id, slug, title, description, image } = project;

          return (
            <OverviewCard
              key={id}
              href={
                session
                  ? ROUTES.ADMIN_PROJECT_DETAIL(id)
                  : ROUTES.PROJECT_DETAIL(`${slug}-${id}`)
              }
              title={title}
              description={description}
              imageSrc={image || '/image-not-available.webp'}
              isRowDisplay={true}
              customClass={{
                wrapper: 'hover:bg-zinc-100 dark:hover:bg-zinc-700',
                image: 'md:aspect-square w-full h-full',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export { ProjectList };
