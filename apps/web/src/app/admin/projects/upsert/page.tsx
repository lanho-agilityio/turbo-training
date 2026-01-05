// APIs
import { queryUserList } from '@/api/users';
import { getProjectById } from '@/api/projects';
import { getParticipatorsByProjectId } from '@/api/participations';

// Components
import { ItemNotFound } from '@repo/ui/components/ItemNotFound';
import { CreateProjectFormWrapper } from '@/ui/project/CreateProjectFormWrapper';
import { EditProjectFormWrapper } from '@/ui/project/EditProjectFormWrapper';

// Constants
import { ERROR_MESSAGES } from '@repo/ui/constants/messages';

const UpsertProjectPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) => {
  const { id } = await searchParams;

  const { data: userList, error: userListError } = await queryUserList();
  const { data: projectData, error: projectError } = id
    ? await getProjectById(id)
    : { data: null, error: '' };
  const { data: participationData, error: participationError } = id
    ? await getParticipatorsByProjectId(id)
    : { data: null, error: '' };

  const isEdited = !!projectData;
  const error = userListError || (!!id && (projectError || participationError));

  return (
    <main className="p-4 flex flex-col gap-8 pt-8 justify-items-stretch">
      <div className=" dark:text-white ">
        <h1 className="font-bold text-3xl">Projects</h1>
      </div>
      <div className="w-full text-center lg:py-4">
        <h2 className="text-2xl lg:text-3xl">
          {isEdited ? `Edit Project: ${projectData.title}` : 'Create a Project'}
        </h2>
      </div>
      <div className="bg-white dark:bg-zinc-800 rounded-lg">
        <div className="w-full md:w-2/3 max-w-3xl p-10 mx-auto ">
          {error ? (
            <ItemNotFound
              title={ERROR_MESSAGES.REQUESTING_DATA}
              description={`Please try again later. (Error:${error})`}
            />
          ) : (
            <>
              {isEdited ? (
                <EditProjectFormWrapper
                  memberOptions={userList}
                  data={projectData}
                  participations={
                    participationData?.map((user) => user.userId) || []
                  }
                />
              ) : (
                <CreateProjectFormWrapper memberOptions={userList} />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default UpsertProjectPage;
