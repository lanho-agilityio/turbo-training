// APIs
import { getTaskById } from '@/api/tasks';

// Components
import { EditTaskContainer } from '@/ui/task/EditTaskContainer';
import { ErrorMessage } from '@repo/ui/components/ErrorMessage';
import { ItemNotFound } from '@repo/ui/components/ItemNotFound';

// Constants
import { ERROR_MESSAGES } from '@repo/ui/constants/messages';

const EditTaskPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  if (!id) {
    return null;
  }

  const { data: taskData, error: taskError } = await getTaskById(id);

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
    return <EditTaskContainer taskData={taskData} />;
  };

  return (
    <main className="p-4 flex flex-col gap-8 pt-8 justify-items-stretch">
      <div className="dark:text-white ">
        <h1 className="font-bold text-3xl">Tasks</h1>
      </div>
      <div className="w-full text-center py-4">
        <h1 className="font-bold text-3xl">Edit Task: {taskData?.title}</h1>
      </div>
      <div className="bg-white dark:bg-zinc-800 rounded-lg">
        <div className="w-full md:w-2/3 max-w-3xl p-10 mx-auto ">
          {renderTaskDetail()}
        </div>
      </div>
    </main>
  );
};

export default EditTaskPage;
