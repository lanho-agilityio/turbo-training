import { addDoc, collection } from "firebase/firestore";
import { Effect } from "effect";

// DB
import { Config, FirestoreService } from "./query";

// Constants
import { COLLECTION } from "@repo/ui/constants/collection";

// Models
import { Project } from "@repo/db/models/projects";
import {
  FirestoreError,
  ProjectArchived,
  ProjectNotFound,
} from "@repo/db/models/base";

export const createProject = (values: Omit<Project, "id">) => {
  return Effect.gen(function* () {
    const { config } = yield* (yield* Config).getConfig;
    const projectRef = yield* Effect.tryPromise({
      try: () => addDoc(collection(config, COLLECTION.PROJECTS), values),
      catch: (cause) => new FirestoreError({ cause }),
    });
    const createdProject = {
      ...values,
      id: projectRef.id,
    } as Project;
    return {
      success: true,
      data: createdProject,
      error: undefined,
    };
  });
};

export const updateProject = (
  id: string,
  values: Omit<Project, "memberIds"> & {
    updatedAt: string;
  }
) => {
  return Effect.gen(function* () {
    const service = yield* FirestoreService;
    const getResult = yield* service.getDocument<Project>(
      COLLECTION.PROJECTS,
      id
    );
    if (!getResult.data) {
      return yield* Effect.fail(new ProjectNotFound());
    }
    if (getResult.data.isArchived) {
      return yield* Effect.fail(new ProjectArchived());
    }
    const updatedData = {
      ...getResult.data,
      ...values,
      id,
    } as Project & { id: string };
    yield* service.updateDocument<Project>(COLLECTION.PROJECTS, updatedData);
    return {
      success: true,
      data: updatedData,
      error: undefined,
    };
  });
};

export const deleteProject = (projectId: string) => {
  return Effect.gen(function* () {
    const service = yield* FirestoreService;
    const getResult = yield* service.getDocument<Project>(
      COLLECTION.PROJECTS,
      projectId
    );
    if (!getResult.data) {
      return yield* Effect.fail(new ProjectNotFound());
    }
    if (getResult.data.isArchived) {
      return yield* Effect.fail(new ProjectArchived());
    }
    yield* service.deleteDocument(COLLECTION.PROJECTS, projectId);
    return {
      success: true,
      data: undefined,
      error: undefined,
    };
  });
};

export const getProjectDetail = (id: string) => {
  return Effect.gen(function* () {
    const service = yield* FirestoreService;
    const result = yield* service.getDocument<Project>(COLLECTION.PROJECTS, id);
    return {
      success: true,
      data: result.data,
      error: undefined,
    };
  });
};
