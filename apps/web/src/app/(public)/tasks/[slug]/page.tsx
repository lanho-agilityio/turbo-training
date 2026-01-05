// APIs
import { getTaskById } from '@/api/tasks';

// Components
import { EditTaskContainer } from '@/ui/task/EditTaskContainer';
import { ErrorMessage } from '@repo/ui/components/ErrorMessage';
import { ItemNotFound } from '@repo/ui/components/ItemNotFound';

// Constants
import { OPEN_GRAPH_IMAGE } from '@repo/ui/constants/images';
import { ERROR_MESSAGES } from '@repo/ui/constants/messages';
import { ROUTES } from '@repo/ui/constants/routes';

// Types
import { Metadata } from 'next';
import { getIdFromSlug } from '@repo/ui/utils/slugs';

type Props = {
  params: Promise<{ slug: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_URL;

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const taskId = slug ? getIdFromSlug(slug) : undefined;

  if (!taskId) {
    return {} as Metadata;
  }

  const { data: task } = await getTaskById(taskId);
  return {
    title: task?.title,
    description: task?.description,
    openGraph: {
      title: task?.title,
      description: task?.description,
      url: `${BASE_URL}${ROUTES.TASK_DETAIL(`${task?.slug}-${task?.id}`)}`,
      images: [
        {
          url: task?.image || OPEN_GRAPH_IMAGE,
          width: 1200,
          height: 630,
          alt: task?.description,
        },
      ],
    },
  };
};

const TaskDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const taskId = slug ? getIdFromSlug(slug) : undefined;

  if (!taskId) {
    return null;
  }
  const { data: taskData, error: taskError } = await getTaskById(taskId);

  // Determine if there is an error in fetching data
  const error = taskError;

  const renderTaskDetail = () => {
    if (error) {
      return <ErrorMessage message={error} />;
    }
    if (!taskData) {
      return (
        <ItemNotFound
          title={ERROR_MESSAGES.DATA_NOT_FOUND}
          description="Please try again later"
          customClass={{
            wrapper: 'rounded-lg px-5 bg-white py-20',
          }}
        />
      );
    }
    return <EditTaskContainer taskData={taskData} isReadOnly={true} />;
  };

  return (
    <main className="p-4 flex flex-col gap-8 pt-8 justify-items-stretch">
      <div className=" dark:text-white ">
        <h1 className="font-bold text-3xl">Tasks</h1>
      </div>
      <div className="w-full text-center py-4">
        <h1 className="font-bold text-3xl">{taskData?.title}</h1>
      </div>
      <div className="bg-white dark:bg-zinc-800 rounded-lg">
        <div className="w-full md:w-2/3 max-w-3xl p-10 mx-auto ">
          {renderTaskDetail()}
        </div>
      </div>
    </main>
  );
};

export default TaskDetailPage;
