'use client';
import { useState } from 'react';

// Components
import { Button } from '@repo/ui/components/Button';
import { EditParticipantModal } from './EditParticipantModal';

// Icons
import { AddIcon } from '@repo/ui/icons/AddIcon';

// Types
import type { User } from '@repo/ui/types/users';

type EditParticipantProps = {
  projectId: string;
  memberOptions: User[];
  participations: string[];
};

export const EditParticipant = ({
  projectId,
  memberOptions,
  participations,
}: EditParticipantProps) => {
  const [isOpenEditModal, setOpenEditModal] = useState<boolean>(false);

  const handleOpenEditParticipantModal = () => {
    setOpenEditModal(true);
  };

  return (
    <>
      <Button
        onClick={handleOpenEditParticipantModal}
        startIcon={<AddIcon customClass="w-5 h-5 mr-2" />}
        variant="outline"
        customClass="border-black hover:bg-zinc-300 font-bold dark:text-white"
      >
        Edit members
      </Button>
      <EditParticipantModal
        projectId={projectId}
        memberOptions={memberOptions}
        participations={participations}
        isOpen={isOpenEditModal}
        setModalState={setOpenEditModal}
      />
    </>
  );
};
