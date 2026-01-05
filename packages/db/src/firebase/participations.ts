import { doc, writeBatch } from "firebase/firestore";
import { User } from "next-auth";
import { Effect } from "effect";

// Constants
import { COLLECTION } from "@repo/ui/constants/collection";
import { QUERY_PARAMS } from "@repo/ui/constants/queryParams";

// DB
import { Config, FirestoreService } from "./query";

// Models
import { Participation } from "@repo/db/models/participations";
import { Project } from "@repo/db/models/projects";
import {
  FirestoreError,
  ProjectArchived,
  ProjectNotFound,
} from "@repo/db/models/base";

// Utils
import { getErrorMessage } from "@repo/db/utils/form-handlers";

export const assignUsersToProject = (
  participants: User[],
  projectId: string,
  rollbackFunction?: (id: string) => Promise<unknown>,
  isProjectRecentlyCreated = false
) => {
  return Effect.gen(function* () {
    const service = yield* FirestoreService;
    const projectResult = yield* service.getDocument<Project>(
      COLLECTION.PROJECTS,
      projectId
    );
    if (!projectResult.data) {
      return yield* Effect.fail(new ProjectNotFound());
    }
    if (projectResult.data.isArchived) {
      return yield* Effect.fail(new ProjectArchived());
    }
    if (participants.length === 0) {
      return {
        success: true,
        data: [],
        error: undefined,
      };
    }
    const { config } = yield* (yield* Config).getConfig;
    const batch = writeBatch(config);
    participants.forEach((user) => {
      batch.set(
        doc(config, COLLECTION.PARTICIPATIONS, `${user.id}-${projectId}`),
        {
          userId: user.id,
          name: user.name,
          projectId: projectId,
          createdAt: new Date().toISOString(),
        }
      );
    });
    yield* Effect.tryPromise({
      try: () => batch.commit(),
      catch: (cause) => new FirestoreError({ cause }),
    });
    return {
      success: true,
      data: participants,
    };
  }).pipe(
    Effect.catchAll((error) => {
      if (isProjectRecentlyCreated && rollbackFunction) {
        Effect.runPromise(
          Effect.promise(() => rollbackFunction(projectId))
        ).catch(() => {});
      }
      return Effect.succeed({
        success: false,
        data: [],
        error: getErrorMessage(error),
      });
    })
  );
};

export const removeUsersFromProject = (
  projectId: string,
  participants?: string[],
  rollbackFunction?: (id: string) => Promise<unknown>,
  isProjectRecentlyCreated = false
) => {
  return Effect.gen(function* () {
    const service = yield* FirestoreService;
    const projectResult = yield* service.getDocument<Project>(
      COLLECTION.PROJECTS,
      projectId
    );
    if (!projectResult.data) {
      return yield* Effect.fail(new ProjectNotFound());
    }
    if (projectResult.data.isArchived) {
      return yield* Effect.fail(new ProjectArchived());
    }
    let removedList: string[] = [];
    if (participants && participants.length > 0) {
      removedList = participants;
    } else {
      const participantResponse = yield* service.getDocuments<Participation>(
        COLLECTION.PARTICIPATIONS,
        {
          query: [
            {
              field: QUERY_PARAMS.PROJECT_ID,
              comparison: "==",
              value: projectId,
            },
          ],
        }
      );
      removedList = participantResponse.data.map((p) => p.userId);
    }
    if (removedList.length === 0) {
      return {
        success: true,
        data: [],
        error: undefined,
      };
    }
    const { config } = yield* (yield* Config).getConfig;
    const batch = writeBatch(config);
    removedList.forEach((userId) => {
      batch.delete(
        doc(config, COLLECTION.PARTICIPATIONS, `${userId}-${projectId}`)
      );
    });
    yield* Effect.tryPromise({
      try: () => batch.commit(),
      catch: (cause) => new FirestoreError({ cause }),
    });
    return {
      success: true,
      data: removedList,
    };
  }).pipe(
    Effect.catchAll((error) => {
      if (isProjectRecentlyCreated && rollbackFunction) {
        Effect.runPromise(
          Effect.promise(() => rollbackFunction(projectId))
        ).catch(() => {});
      }
      return Effect.succeed({
        success: false,
        data: [],
        error: getErrorMessage(error),
      });
    })
  );
};

export const queryParticipatorsByProjectId = (projectId: string) => {
  return Effect.gen(function* () {
    const service = yield* FirestoreService;
    const response = yield* service.getDocuments<Participation>(
      COLLECTION.PARTICIPATIONS,
      {
        query: [
          {
            field: QUERY_PARAMS.PROJECT_ID,
            comparison: "==",
            value: projectId,
          },
        ],
      }
    );
    return {
      success: true,
      data: response.data,
      total: response.total,
      error: undefined,
    };
  });
};

export const queryAssignedProjectsByUserId = (userId: string) => {
  return Effect.gen(function* () {
    const service = yield* FirestoreService;
    const response = yield* service.getDocuments<Participation>(
      COLLECTION.PARTICIPATIONS,
      {
        query: [
          {
            field: QUERY_PARAMS.USER_ID,
            comparison: "==",
            value: userId,
          },
        ],
      }
    );
    if (!response.data) {
      return yield* Effect.fail(new ProjectNotFound());
    }
    return yield* Effect.succeed({
      success: true,
      data: response.data,
      error: undefined,
    });
  });
};
