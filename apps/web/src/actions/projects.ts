'use server';
import { redirect } from 'next/navigation';
import { Effect } from 'effect';
import { revalidateTag } from 'next/cache';

// Constants
import { ERROR_MESSAGES } from '@repo/ui/constants/messages';
import { ROUTES } from '@repo/ui/constants/routes';
import { TAGS } from '@repo/ui/constants/tags';
import { COLLECTION } from '@repo/ui/constants/collection';

// DBs
import {
  assignUsersToProject,
  removeUsersFromProject,
  queryParticipatorsByProjectId,
} from '@repo/db/firebase/participations';
import {
  createProject,
  updateProject,
  getProjectDetail,
  deleteProject,
} from '@repo/db/firebase/projects';
import { deleteTasksByProjectId } from '@repo/db/firebase/tasks';
import { FirestoreService } from '@repo/db/firebase/query';

// Models
import { Project, ProjectFormState } from '@repo/db/models/projects';
import {
  ProjectFormTypeWithMembers,
  ProjectFormDataSchema,
} from '@repo/db/models/schemas';
import { ResponseStateType } from '@repo/ui/types/responses';
import {
  FirestoreError,
  ProjectNotFound,
  UnauthorizedAccess,
} from '@repo/db/models/base';

// Services
import { AuthService } from '@/services/auth-services';
import { MainLive, ServiceLive } from '@/services/main-live';

// Utils
import { effectSafeParse, getErrorMessage } from '@repo/db/utils/form-handlers';

export const createProjectWithParticipants = async (
  prevState: ProjectFormState,
  values: ProjectFormTypeWithMembers,
): Promise<ProjectFormState> => {
  const parseResult = await effectSafeParse(ProjectFormDataSchema, values);
  if (!parseResult.success || !parseResult.data) {
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
    const time = new Date().toISOString();
    const projectPayload: Omit<Project, 'id'> = {
      title: parseResult.data.title,
      slug: parseResult.data.slug,
      description: parseResult.data.description,
      image: parseResult.data.image,
      createdAt: time,
      updatedAt: time,
      isArchived: false,
      isPublic: parseResult.data.isPublic,
      createdBy: session.user.id,
    };
    const projectResponse = yield* createProject(projectPayload);
    if (!projectResponse.success || !projectResponse.data) {
      return yield* Effect.fail(new ProjectNotFound());
    }
    const newProject = projectResponse.data;
    const membersWithCurrentUser = [...values.members, session.user];
    const rollbackFunction = async (id: string) => {
      const effectProgram = deleteProject(id);
      const runnable = effectProgram.pipe(Effect.provide(ServiceLive));
      return await Effect.runPromise(runnable);
    };
    const participantResponse = yield* assignUsersToProject(
      membersWithCurrentUser,
      newProject.id,
      rollbackFunction,
      true,
    );
    if (!participantResponse.success) {
      return yield* Effect.fail(
        new FirestoreError({ cause: ERROR_MESSAGES.GENERAL_ERROR }),
      );
    }
    return {
      success: true,
      data: newProject,
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
    revalidateTag(TAGS.PROJECT_LIST, { expire: undefined });
    redirect(ROUTES.ADMIN_PROJECT_DETAIL(result.data.id));
  }
  return result;
};

export const updateProjectWithParticipants = async (
  id: string,
  prevState: ProjectFormState,
  newData: ProjectFormTypeWithMembers,
): Promise<ProjectFormState> => {
  const parseResult = await effectSafeParse(ProjectFormDataSchema, newData);
  if (!parseResult.success || !parseResult.data) {
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
    const time = new Date().toISOString();
    const projectPayload: Partial<Project> = {
      title: parseResult.data.title,
      slug: parseResult.data.slug,
      description: parseResult.data.description,
      image: parseResult.data.image,
      isPublic: parseResult.data.isPublic,
      updatedAt: time,
    };
    const projectResponse = yield* updateProject(id, projectPayload as any);
    if (!projectResponse.success || !projectResponse.data) {
      return yield* Effect.fail(new ProjectNotFound());
    }
    const updatedProject = projectResponse.data;
    const previousParticipantsResponse =
      yield* queryParticipatorsByProjectId(id);
    if (
      !previousParticipantsResponse.success ||
      !previousParticipantsResponse.data
    ) {
      return yield* Effect.fail(
        new FirestoreError({ cause: ERROR_MESSAGES.GENERAL_ERROR }),
      );
    }
    const currentUserIds = previousParticipantsResponse.data.map(
      (p) => p.userId,
    );
    const removedParticipants = currentUserIds.filter(
      (userId) => !newData.memberIds.includes(userId),
    );
    if (removedParticipants.length > 0) {
      const removeResult = yield* removeUsersFromProject(
        id,
        removedParticipants,
      );

      if (!removeResult.success) {
        return yield* Effect.fail(
          new FirestoreError({ cause: ERROR_MESSAGES.GENERAL_ERROR }),
        );
      }
    }
    const updatedMembers = [...newData.members, session.user];
    const assignResult = yield* assignUsersToProject(updatedMembers, id);
    if (!assignResult.success) {
      return yield* Effect.fail(
        new FirestoreError({ cause: ERROR_MESSAGES.GENERAL_ERROR }),
      );
    }
    return {
      success: true,
      data: updatedProject,
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
    revalidateTag(TAGS.PROJECT_LIST, { expire: undefined });
    revalidateTag(TAGS.PROJECT_DETAIL(result.data.slug), {
      expire: undefined,
    });
    revalidateTag(TAGS.PROJECT_DETAIL(id), { expire: undefined });
    redirect(ROUTES.ADMIN_PROJECT_DETAIL(id));
  }
  return result;
};

export const removeProjectById = async (
  projectId: string,
): Promise<
  ResponseStateType<{
    projectId: string;
  } | null>
> => {
  const program = Effect.gen(function* () {
    const session = yield* (yield* AuthService).getSession;
    if (!session) {
      return yield* Effect.fail(new UnauthorizedAccess());
    }
    const projectResult = yield* getProjectDetail(projectId);
    if (!projectResult.success || !projectResult.data) {
      return yield* Effect.fail(new ProjectNotFound());
    }
    const slug = projectResult.data.slug;
    const usersResult = yield* removeUsersFromProject(projectId);
    if (!usersResult.success) {
      return yield* Effect.fail(
        new FirestoreError({ cause: ERROR_MESSAGES.GENERAL_ERROR }),
      );
    }
    const tasksResult = yield* deleteTasksByProjectId(projectId);
    if (!tasksResult.success) {
      return yield* Effect.fail(
        new FirestoreError({ cause: ERROR_MESSAGES.GENERAL_ERROR }),
      );
    }
    const deleteResult = yield* deleteProject(projectId);
    if (!deleteResult.success) {
      return yield* Effect.fail(
        new FirestoreError({ cause: ERROR_MESSAGES.GENERAL_ERROR }),
      );
    }
    return {
      success: true,
      data: { slug, projectId },
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
    revalidateTag(TAGS.TASK_LIST, { expire: undefined });
    revalidateTag(TAGS.PROJECT_LIST, { expire: undefined });
    revalidateTag(TAGS.PROJECT_DETAIL(result.data.slug), {
      expire: undefined,
    });
    revalidateTag(TAGS.PROJECT_DETAIL(projectId), {
      expire: undefined,
    });
  }
  return result;
};

export const archiveProjectById = async (
  id: string,
  isArchived: boolean,
): Promise<ResponseStateType<{ slug: string } | null>> => {
  const program = Effect.gen(function* () {
    const session = yield* (yield* AuthService).getSession;
    const service = yield* FirestoreService;
    if (!session) {
      return yield* Effect.fail(new UnauthorizedAccess());
    }
    const projectResult = yield* getProjectDetail(id);
    if (!projectResult.success || !projectResult.data) {
      return {
        success: false,
        data: null,
        error: ERROR_MESSAGES.DATA_NOT_FOUND,
      };
    }
    const slug = projectResult.data.slug;
    const updateResult = yield* service.updateDocument(COLLECTION.PROJECTS, {
      id,
      isArchived,
    });

    if (!updateResult.success) {
      return {
        success: false,
        data: null,
        error: ERROR_MESSAGES.UPSERTING_DATA_ERROR('Project'),
      };
    }
    return {
      success: true,
      data: { slug },
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
    revalidateTag(TAGS.PROJECT_LIST, { expire: undefined });
    revalidateTag(TAGS.PROJECT_DETAIL(id), { expire: undefined });
    revalidateTag(TAGS.PROJECT_DETAIL(result.data.slug), { expire: undefined });
  }
  return result;
};
