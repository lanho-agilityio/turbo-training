'use client';

import { useActionState } from 'react';

// APIs
import { editTask } from '@/actions/tasks';

// Components
import { TaskForm } from '../TaskForm';

// Models
import { Participation } from '@repo/db/models/participations';
import { Project } from '@repo/db/models/projects';
import { Task } from '@repo/db/models/tasks';

type CreateTaskFormWrapperProps = {
  project: Project;
  taskData: Task;
  isReadOnly: boolean;
  memberOptions: Participation[];
};

export const EditTaskFormWrapper = ({
  project,
  taskData,
  isReadOnly,
  memberOptions,
}: CreateTaskFormWrapperProps) => {
  const initialState = { message: null, formErrors: {} };
  const editTaskWithId = editTask.bind(null, taskData.id);
  const [state, dispatch] = useActionState(editTaskWithId, initialState);

  return (
    <TaskForm
      state={state}
      assignedToOptions={memberOptions}
      fromProject={project}
      taskValue={taskData}
      onSubmit={dispatch}
      isReadOnly={isReadOnly}
    />
  );
};
