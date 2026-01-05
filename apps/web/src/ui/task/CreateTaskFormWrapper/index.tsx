'use client';

import { useActionState } from 'react';

// APIs
import { addTaskToProject } from '@/actions/tasks';

// Components
import { TaskForm } from '../TaskForm';

// Models
import { Project } from '@repo/db/models/projects';
import { Participation } from '@repo/db/models/participations';

type CreateTaskFormWrapperProps = {
  memberOptions: Participation[];
  project: Project;
};

export const CreateTaskFormWrapper = ({
  memberOptions,
  project,
}: CreateTaskFormWrapperProps) => {
  const initialState = { message: null, formErrors: {} };
  const [state, dispatch] = useActionState(addTaskToProject, initialState);

  return (
    <TaskForm
      assignedToOptions={memberOptions}
      fromProject={project}
      state={state}
      onSubmit={dispatch}
    />
  );
};
