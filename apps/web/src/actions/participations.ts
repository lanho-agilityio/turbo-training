'use server';
import { revalidateTag } from 'next/cache';
import { Effect } from 'effect';

// Constants
import { TAGS } from '@repo/ui/constants/tags';
import { ERROR_MESSAGES } from '@repo/ui/constants/messages';

// DBs
import {
  assignUsersToProject,
  queryParticipatorsByProjectId,
  removeUsersFromProject,
} from '@repo/db/firebase/participations';

// Models
import { ParticipationFormState } from '@repo/db/models/participations';
import {
  ParticipationFormTypeWithMembers,
  ParticipationFormDataSchema,
} from '@repo/db/models/schemas';
import { FirestoreError, UnauthorizedAccess } from '@repo/db/models/base';

// Services
import { AuthService } from '@/services/auth-services';
import { MainLive } from '@/services/main-live';

// Utils
import { effectSafeParse, getErrorMessage } from '@repo/db/utils/form-handlers';

export const editParticipants = async (
  projectId: string,
  newData: ParticipationFormTypeWithMembers,
): Promise<ParticipationFormState> => {
  const parseResult = await effectSafeParse(
    ParticipationFormDataSchema,
    newData,
  );
  if (!parseResult.success) {
    return {
      success: false,
      formErrors: parseResult.errors,
    };
  }
  const program = Effect.gen(function* () {
    const session = yield* (yield* AuthService).getSession;
    if (!session) {
      return yield* Effect.fail(new UnauthorizedAccess());
    }

    const previousParticipantsResponse =
      yield* queryParticipatorsByProjectId(projectId);
    if (!previousParticipantsResponse.success) {
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
        projectId,
        removedParticipants,
      );
      if (!removeResult.success) {
        return yield* Effect.fail(
          new FirestoreError({ cause: ERROR_MESSAGES.GENERAL_ERROR }),
        );
      }
    }
    const updatedMembers = [...newData.members, session.user];
    const assignResult = yield* assignUsersToProject(updatedMembers, projectId);
    if (!assignResult.success) {
      return yield* Effect.fail(
        new FirestoreError({ cause: ERROR_MESSAGES.GENERAL_ERROR }),
      );
    }
    return {
      success: true,
    };
  });
  const runnable = program.pipe(Effect.provide(MainLive));
  const result = await Effect.runPromise(
    runnable.pipe(
      Effect.catchAll((error) =>
        Effect.succeed({
          success: false,
          error: getErrorMessage(error),
        }),
      ),
    ),
  );
  if (result.success) {
    revalidateTag(TAGS.PROJECT_DETAIL(projectId), { expire: undefined });
  }
  return result;
};
