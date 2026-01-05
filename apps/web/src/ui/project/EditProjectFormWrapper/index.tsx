'use client';

import { useActionState } from 'react';

// APIs
import { updateProjectWithParticipants } from '@/actions/projects';

// Components
import { ProjectForm } from '../ProjectForm';

// Models
import { Project } from '@repo/db/models/projects';

// Types
import type { User } from '@repo/ui/types/users';

type EditProjectFormWrapperProps = {
  data: Project;
  memberOptions: User[];
  participations: string[];
};

export const EditProjectFormWrapper = ({
  data,
  memberOptions,
  participations,
}: EditProjectFormWrapperProps) => {
  const initialState = { message: null, formErrors: {} };
  const updateProjectWithParticipantsWithId =
    updateProjectWithParticipants.bind(null, data.id);
  const [state, dispatch] = useActionState(
    updateProjectWithParticipantsWithId,
    initialState,
  );

  return (
    <ProjectForm
      memberOptions={memberOptions}
      onSubmit={dispatch}
      state={state}
      projectValue={data}
      participations={participations}
    />
  );
};
