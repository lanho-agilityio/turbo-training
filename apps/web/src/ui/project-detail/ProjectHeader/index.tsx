// Auths
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

// APIs
import { getParticipatorsByProjectId } from '@/api/participations';
import { queryUserList } from '@/api/users';

// Components
import { FilterWrapper } from '../../task/FilterWrapper';
import { EditParticipant } from '../EditParticipant';
import { ProjectActionBar } from '../ProjectActionBar';
import { AvatarGroup } from '@repo/ui/components/AvatarGroup';
import { ErrorMessage } from '@repo/ui/components/ErrorMessage';

// Constants
import { DATE_FORMAT } from '@repo/ui/constants/dates';

// Models
import { Project } from '@repo/db/models/projects';

// Icons
import { FaLock, FaLockOpen } from 'react-icons/fa';

// Utils
import { formatDate } from '@repo/ui/utils/dates';

type ProjectHeaderProps = {
  project: Project;
};

export const ProjectHeader = async ({ project }: ProjectHeaderProps) => {
  const { id, title, isArchived, isPublic, createdAt } = project;

  const session = await getServerSession(authOptions);
  const { data: participationData, error: participationError } =
    await getParticipatorsByProjectId(id);
  const { data: userList, error: userListError } = await queryUserList();

  const error = participationError || userListError;

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <>
      <div className="grid grid-rows-1 lg:grid-cols-5 px-7 py-12 bg-zinc-100 dark:bg-neutral-700 rounded-lg items-center lg:place-items-center gap-4 lg:max-h-40">
        <span className="font-bold text-2xl dark:text-white">{title}</span>
        <div className="lg:col-span-2 flex w-full justify-start lg:justify-center gap-4">
          <AvatarGroup listUsers={participationData} maxDisplayed={3} />
          {!isArchived && session && (
            <EditParticipant
              projectId={id}
              memberOptions={userList}
              participations={participationData.map((user) => user.userId)}
            />
          )}
        </div>
        <div className="font-bold text-base dark:text-white dark:fill-white">
          <span className="flex flex-rows gap-4">
            {isPublic ? (
              <>
                {' '}
                <FaLockOpen className="w-5 h-5" />
                Public
              </>
            ) : (
              <>
                {' '}
                <FaLock className="w-5 h-5" />
                Private{' '}
              </>
            )}
            {isArchived && '(Archived)'}
          </span>
        </div>

        <div className="flex flex-col gap-3 dark:text-white">
          <span>Created</span>
          <time className="font-bold text-lg">
            {formatDate(createdAt, DATE_FORMAT.Secondary)}
          </time>
        </div>
      </div>
      <div className="flex gap-5 flex-col-reverse md:flex-row justify-between mt-5">
        <FilterWrapper
          assignedToList={
            Array.isArray(participationData) ? participationData : []
          }
          showPriorityFilter={true}
        />
        <div className="mt-0.5">
          {session && (
            <ProjectActionBar projectId={id} isArchived={isArchived} />
          )}
        </div>
      </div>
    </>
  );
};
