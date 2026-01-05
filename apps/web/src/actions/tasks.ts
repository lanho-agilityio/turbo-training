'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { Effect } from 'effect';
import type { Session } from 'next-auth';

// Constants
import { ERROR_MESSAGES } from '@repo/ui/constants/messages';
import { ROUTES } from '@repo/ui/constants/routes';
import { TAGS } from '@repo/ui/constants/tags';
import {
  TASK_PRIORITY_VALUE,
  TASK_STATUS_VALUE,
} from '@repo/ui/constants/tasks';

// DB
import {
  deleteTask,
  updateTask,
  createTask,
  getTaskDetailById,
} from '@repo/db/firebase/tasks';

// Models
import { Task, TaskFormState } from '@repo/db/models/tasks';
import { TaskFormDataType, TaskFormDataSchema } from '@repo/db/models/schemas';
import { ResponseStateType } from '@repo/ui/types/responses';
import {
  FirestoreError,
  TaskNotFound,
  UnauthorizedAccess,
} from '@repo/db/models/base';

// Services
import { AuthService } from '@/services/auth-services';
import { MainLive } from '@/services/main-live';

// Utils
import { effectSafeParse, getErrorMessage } from '@repo/db/utils/form-handlers';

const taskPayload = (values: TaskFormDataType, session: Session) => {
  const time = new Date().toISOString();
  const dueDateIntoISO = new Date(values.dueDate).toISOString();

  return {
    slug: values.slug,
    title: values.title,
    description: values.description,
    assignedTo: values.assignedTo,
    createdAt: time,
    createdBy: session.user.id,
    dueDate: dueDateIntoISO,
    image: values.image,
    isArchived: false,
    priority: values.priority as TASK_PRIORITY_VALUE,
    status: values.status as TASK_STATUS_VALUE,
    updatedAt: time,
    projectId: values.projectId,
  };
};

export const addTaskToProject = async (
  prevState: TaskFormState,
  values: TaskFormDataType,
): Promise<TaskFormState> => {
  const parseResult = await effectSafeParse(TaskFormDataSchema, values);
  if (!parseResult.success) {
    return {
      success: false,
      data: null,
      formErrors: parseResult.errors,
    };
  }
  const program = Effect.gen(function* () {
    const session = yield* (yield* AuthService).getSession;
    if (!session) {
      return yield* Effect.fail(new UnauthorizedAccess());
    }
    const payload: Omit<Task, 'id'> = taskPayload(values, session);
    const createResult = yield* createTask(payload);
    if (createResult) {
      const newTask = createResult.data;
      return {
        success: true,
        data: newTask,
        error: undefined,
      };
    } else {
      return yield* Effect.fail(
        new FirestoreError({ cause: ERROR_MESSAGES.GENERAL_ERROR }),
      );
    }
  });
  const runnable = program.pipe(Effect.provide(MainLive));
  const result = await Effect.runPromise(
    runnable.pipe(
      Effect.catchAll((error) =>
        Effect.succeed({
          success: false,
          data: null,
          error: getErrorMessage(error),
        }),
      ),
    ),
  );
  if (result.success && result.data) {
    revalidateTag(TAGS.TASK_LIST, 'max');
    revalidateTag(TAGS.PROJECT_DETAIL(result.data.projectId), {
      expire: undefined,
    });
    redirect(ROUTES.ADMIN_PROJECT_DETAIL(result.data.projectId));
  }
  return result;
};

export const editTask = async (
  taskId: string,
  prevState: TaskFormState,
  values: TaskFormDataType,
): Promise<TaskFormState> => {
  const parseResult = await effectSafeParse(TaskFormDataSchema, values);
  if (!parseResult.success) {
    return {
      success: false,
      data: null,
      formErrors: parseResult.errors,
    };
  }
  const program = Effect.gen(function* () {
    const session = yield* (yield* AuthService).getSession;
    if (!session) {
      return yield* Effect.fail(new UnauthorizedAccess());
    }
    if (!parseResult.success) {
      return {
        success: false,
        data: null,
        formErrors: parseResult.errors,
      };
    }
    const payload = {
      ...taskPayload(values, session),
      id: taskId,
    };
    const updateResult = yield* updateTask(taskId, payload);
    if (!updateResult.success || !updateResult.data) {
      return {
        success: false,
        data: null,
        error: updateResult.error ?? ERROR_MESSAGES.GENERAL_ERROR,
      };
    }
    const updatedTask = updateResult.data;

    return {
      success: true,
      data: updatedTask,
    };
  });
  const runnable = program.pipe(Effect.provide(MainLive));
  const result = await Effect.runPromise(
    runnable.pipe(
      Effect.catchAll((error) =>
        Effect.succeed({
          success: false,
          data: null,
          error: getErrorMessage(error),
        }),
      ),
    ),
  );
  if (result.success && result.data) {
    revalidateTag(TAGS.TASK_LIST, 'max');
    revalidateTag(TAGS.TASK_DETAIL(taskId), 'max');
    revalidateTag(TAGS.TASK_DETAIL(result.data.slug), {
      expire: undefined,
    });
    redirect(ROUTES.ADMIN_PROJECT_DETAIL(result.data.projectId));
  }
  return result;
};

export const removeTask = async (
  taskId: string,
): Promise<
  ResponseStateType<{
    taskId: string;
    slug: string;
  } | null>
> => {
  const program = Effect.gen(function* () {
    const session = yield* (yield* AuthService).getSession;
    if (!session) {
      return yield* Effect.fail(new UnauthorizedAccess());
    }
    const taskResult = yield* getTaskDetailById(taskId);
    if (!taskResult.success || !taskResult.data) {
      return yield* Effect.fail(new TaskNotFound());
    }
    const slug = taskResult.data.slug;
    const deleteResult = yield* deleteTask(taskId);
    if (!deleteResult.success) {
      return yield* Effect.fail(
        new FirestoreError({ cause: ERROR_MESSAGES.GENERAL_ERROR }),
      );
    }
    return {
      success: true,
      data: { taskId, slug },
      error: undefined,
    };
  });
  const runnable = program.pipe(Effect.provide(MainLive));
  const result = await Effect.runPromise(
    runnable.pipe(
      Effect.catchAll((error) =>
        Effect.succeed({
          success: false,
          data: null,
          error: getErrorMessage(error),
        }),
      ),
    ),
  );
  if (result.success && result.data) {
    revalidateTag(TAGS.TASK_LIST, 'max');
    revalidateTag(TAGS.TASK_DETAIL(taskId), 'max');
    revalidateTag(TAGS.TASK_DETAIL(result.data.slug), {
      expire: undefined,
    });
  }
  return result;
};
