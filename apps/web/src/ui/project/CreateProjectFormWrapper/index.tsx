'use client';

import { useActionState } from 'react';

// APIs
import { createProjectWithParticipants } from '@/actions/projects';

// Components
import { ProjectForm } from '../ProjectForm';

// Models
import type { User } from '@repo/ui/types/users';

type CreateProjectFormWrapperProps = {
  memberOptions: User[];
};

export const CreateProjectFormWrapper = ({
  memberOptions,
}: CreateProjectFormWrapperProps) => {
  const initialState = { message: null, formErrors: {} };
  const [state, dispatch] = useActionState(
    createProjectWithParticipants,
    initialState,
  );

  return (
    <ProjectForm
      memberOptions={memberOptions}
      onSubmit={dispatch}
      state={state}
    />
  );
};
