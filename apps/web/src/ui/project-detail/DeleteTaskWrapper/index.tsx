'use client';

import { useState } from 'react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

// Icons
import { FaTrash } from 'react-icons/fa';
import { ClockIcon } from '@repo/ui/icons/ClockIcon';

// Components
import { Badge } from '@repo/ui/components/Badge';
import { BaseModal } from '@repo/ui/components/BaseModal';
import { Button } from '@repo/ui/components/Button';
import { OverviewCard } from '@repo/ui/components/OverviewCard';

// Constants
import { DATE_FORMAT } from '@repo/ui/constants/dates';
import { SUCCESS_MESSAGES } from '@repo/ui/constants/messages';
import { ROUTES } from '@repo/ui/constants/routes';

// Types
import { Task } from '@repo/db/models/tasks';

// Utils
import { formatDate } from '@repo/ui/utils/dates';

// Actions
import { removeTask } from '@/actions/tasks';

// HOCs
import { TWithToast, withToast } from '@repo/ui/hocs/withToast';

type DeleteTaskWrapperProps = {
  session: Session | null;
  task: Task;
  isLate: boolean;
};

export const DeleteTaskWrapper = ({
  session,
  task,
  isLate,
}: DeleteTaskWrapperProps) => {
  const { id, slug, title, description, image, dueDate, priority } = task;
  const [isOpenDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setOpenDeleteModal(true);
  };

  return (
    <>
      <OverviewCard
        key={`task-${id}`}
        href={
          session
            ? ROUTES.ADMIN_TASK_DETAIL(id)
            : ROUTES.TASK_DETAIL(`${slug}-${id}`)
        }
        title={title}
        description={description}
        helperText={priority.toUpperCase()}
        imageSrc={image}
        hasDeleteButton={session ? true : false}
        onClickDelete={handleOpenModal}
        badge={
          <Badge
            label={formatDate(dueDate, DATE_FORMAT.Secondary)}
            icon={<ClockIcon />}
            customClass="rounded-md text-neutral-800 dark:text-white text-sm"
            variant={isLate ? 'error' : 'success'}
          />
        }
        customClass={{
          title: 'mt-3',
          wrapper: 'hover:bg-zinc-300 bg-white',
          description: 'pt-0',
        }}
      />

      <ConfirmDeleteTaskModal
        isOpen={isOpenDeleteModal}
        setModalState={setOpenDeleteModal}
        taskId={id}
      />
    </>
  );
};

type ConfirmDeleteTaskProps = {
  taskId: string;
  isOpen: boolean;
  setModalState: (value: boolean) => void;
};

const ConfirmDeleteTask = ({
  taskId,
  isOpen,
  setModalState,
  openToast,
}: TWithToast<ConfirmDeleteTaskProps>) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDeleteTask = async () => {
    setLoading(true);
    const { success, error } = await removeTask(taskId);
    setLoading(false);
    setModalState(false);
    if (success) {
      openToast({
        variant: 'success',
        message: SUCCESS_MESSAGES.REMOVE_PROJECT,
      });
      router.refresh();
    }
    if (error) {
      openToast({ variant: 'error', message: error });
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={setModalState}
      title="Remove Task?"
      customClass={{
        modalWrappper: 'max-w-screen-sm top-40',
      }}
    >
      <p className="my-6">Do you want to remove this task?</p>
      <div className="w-full flex justify-end mb-2">
        <Button
          isLoading={isLoading}
          startIcon={<FaTrash className="w-5 h-5 mr-2" />}
          customClass="dark:bg-red-500"
          onClick={handleDeleteTask}
        >
          Delete
        </Button>
      </div>
    </BaseModal>
  );
};

export const ConfirmDeleteTaskModal = withToast(ConfirmDeleteTask);
