// APIs
import { getParticipatorsByProjectId } from '@/api/participations';
import { getProjectById } from '@/api/projects';
// Auth
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

// Components
import { EditTaskFormWrapper } from '../EditTaskFormWrapper';
import { ErrorMessage } from '@repo/ui/components/ErrorMessage';
import { ItemNotFound } from '@repo/ui/components/ItemNotFound';

// Constants
import { TAGS } from '@repo/ui/constants/tags';
import { ERROR_MESSAGES } from '@repo/ui/constants/messages';

// Models
import { Task } from '@repo/db/models/tasks';

type EditTaskContainerProps = {
  taskData: Task;
  isReadOnly?: boolean;
};

export const EditTaskContainer = async ({
  taskData,
  isReadOnly = false,
}: EditTaskContainerProps) => {
  const session = await getServerSession(authOptions);
  const projectId = taskData.projectId;
  const { data: participantList, error: participantListError } =
    await getParticipatorsByProjectId(projectId);
  const { data: projectData, error: projectError } = await getProjectById(
    projectId,
    { options: { tags: [TAGS.PROJECT_DETAIL(projectId)] } },
  );

  const error = participantListError || projectError;

  if (error) {
    return <ErrorMessage message={error} />;
  }
  if (!projectData) {
    return (
      <ItemNotFound
        title={ERROR_MESSAGES.DATA_NOT_FOUND}
        description="Please create new user or new project to proceed."
        customClass={{
          wrapper: 'rounded-lg px-5 bg-white py-20',
        }}
      />
    );
  }

  if (!projectData.isPublic && !session) {
    return <ErrorMessage message={ERROR_MESSAGES.UNAUTHORIZED_ACCESS} />;
  }

  return (
    <EditTaskFormWrapper
      memberOptions={participantList}
      project={projectData}
      taskData={taskData}
      isReadOnly={projectData.isArchived || isReadOnly}
    />
  );
};
