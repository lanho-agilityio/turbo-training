'use client';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

// APIS
import { archiveProjectById } from '@/actions/projects';

// Constants
import { SUCCESS_MESSAGES } from '@repo/ui/constants/messages';
import { ROUTES } from '@repo/ui/constants/routes';

// Components
import { Button } from '@repo/ui/components/Button';
import { ConfirmDeleteModal } from '../ConfirmDeleteModal';

// Icons
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';

// HOCs
import { TWithToast, withToast } from '@repo/ui/hocs/withToast';

type ProjectActionBarBaseProps = {
  projectId: string;
  isArchived: boolean;
};

const ProjectActionBarBase = ({
  projectId,
  isArchived,
  openToast,
}: TWithToast<ProjectActionBarBaseProps>) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isOpenDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const router = useRouter();

  const handleRemoveProject = useCallback(() => {
    setOpenDeleteModal(true);
  }, []);

  const handleEditProject = useCallback(() => {
    router.push(ROUTES.ADMIN_PROJECT_UPSERT(projectId));
  }, [projectId, router]);

  const handleCreateNewTask = useCallback(() => {
    router.push(ROUTES.ADMIN_TASK_CREATE());
  }, [router]);

  const handleUnarchiveProject = useCallback(async () => {
    setLoading(true);
    const { success, error } = await archiveProjectById(projectId, false);
    setLoading(false);
    if (success) {
      openToast({
        variant: 'success',
        message: SUCCESS_MESSAGES.UNARCHIVE_PROJECT,
      });
      router.refresh();
    }
    if (error) {
      openToast({ variant: 'error', message: error });
    }
  }, [projectId, openToast, router]);
  return (
    <>
      {!isArchived ? (
        <div className="flex flex-row gap-3 w-full justify-end">
          <Button
            onClick={handleCreateNewTask}
            startIcon={<FaPlus className="w-5 h-5 mr-2" />}
            variant="outline"
            customClass="border-black hover:bg-zinc-300 font-bold dark:text-white md:hidden"
          >
            Create New Task
          </Button>
          <Button
            onClick={handleEditProject}
            startIcon={<FaPen className="w-5 h-5 mr-2" />}
            variant="outline"
            customClass="border-black hover:bg-zinc-300 font-bold dark:text-white"
          >
            Edit
          </Button>
          <Button
            onClick={handleRemoveProject}
            startIcon={<FaTrash className="w-5 h-5 mr-2" />}
            variant="outline"
            customClass="border-black hover:bg-zinc-300 font-bold dark:text-white"
          >
            Remove
          </Button>
        </div>
      ) : (
        <div className="flex flex-row gap-3 w-full justify-end">
          <Button
            isLoading={isLoading}
            onClick={handleUnarchiveProject}
            startIcon={<FaPen className="w-5 h-5 mr-2" />}
            variant="outline"
            customClass="border-black hover:bg-zinc-300 font-bold dark:text-white"
          >
            Unarchive Project
          </Button>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={isOpenDeleteModal}
        setModalState={setOpenDeleteModal}
        projectId={projectId}
      />
    </>
  );
};

export const ProjectActionBar = withToast(ProjectActionBarBase);
