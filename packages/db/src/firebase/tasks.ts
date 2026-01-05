import {
  QueryConstraint,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { Effect } from "effect";

// DB
import { Config, FirestoreService } from "./query";

// Constants
import { COLLECTION } from "@repo/ui/constants/collection";
import { QUERY_PARAMS } from "@repo/ui/constants/queryParams";

// Models
import { Project } from "@repo/db/models/projects";
import { Task } from "@repo/db/models/tasks";

// Types
import {
  FirestoreError,
  ProjectArchived,
  TaskNotFound,
  UpsertingError,
} from "@repo/db/models/base";

export const countTaskByType = (
  field: string,
  value: string,
  userId?: string
) => {
  return Effect.gen(function* () {
    const { config } = yield* (yield* Config).getConfig;
    const queryConstraints: QueryConstraint[] = [where(field, "==", value)];
    if (userId) {
      queryConstraints.push(where(QUERY_PARAMS.ASSIGNED_TO, "==", userId));
    }
    const snapshot = yield* Effect.tryPromise({
      try: () =>
        getCountFromServer(
          query(collection(config, COLLECTION.TASKS), ...queryConstraints)
        ),
      catch: (cause) => new FirestoreError({ cause }),
    });
    return {
      success: true,
      data: value,
      total: snapshot.data().count,
      error: undefined,
    };
  });
};

export const createTask = (data: Omit<Task, "id">) => {
  return Effect.gen(function* () {
    const service = yield* FirestoreService;
    const projectResult = yield* service.getDocument<Project>(
      COLLECTION.PROJECTS,
      data.projectId
    );
    if (!projectResult.data) {
      return yield* Effect.fail(new TaskNotFound());
    }
    if (projectResult.data.isArchived) {
      return yield* Effect.fail(new ProjectArchived());
    }
    const { config } = yield* (yield* Config).getConfig;
    const taskRef = yield* Effect.tryPromise({
      try: () => addDoc(collection(config, COLLECTION.TASKS), data),
      catch: (cause) => new FirestoreError({ cause }),
    });
    const createdTask = {
      ...data,
      id: taskRef.id,
    } as Task;
    return {
      success: true,
      data: createdTask,
      error: undefined,
    };
  });
};

export const updateTask = (id: string, data: Task) => {
  return Effect.gen(function* () {
    const service = yield* FirestoreService;
    const projectResult = yield* service.getDocument<Project>(
      COLLECTION.PROJECTS,
      data.projectId
    );
    if (!projectResult.data) {
      return yield* Effect.fail(new TaskNotFound());
    }
    if (projectResult.data.isArchived) {
      return yield* Effect.fail(new ProjectArchived());
    }
    const taskResult = yield* service.getDocument<Task>("tasks", id);
    if (!taskResult.data) {
      return yield* Effect.fail(new UpsertingError());
    }
    const updateData = { ...data, id } as Task & { id: string };
    yield* service.updateDocument<Task>(COLLECTION.TASKS, updateData);
    return {
      success: true,
      data: updateData,
      error: undefined,
    };
  });
};

export const deleteTask = (taskId: string) => {
  return Effect.gen(function* () {
    const { config } = yield* (yield* Config).getConfig;
    yield* Effect.tryPromise({
      try: () => deleteDoc(doc(config, COLLECTION.TASKS, taskId)),
      catch: (cause) => new FirestoreError({ cause }),
    });
    return {
      success: true,
      data: { taskId },
      error: undefined,
    };
  });
};

export const getTaskDetailById = (taskId: string) => {
  return Effect.gen(function* () {
    const service = yield* FirestoreService;
    const result = yield* service.getDocument<Task>("tasks", taskId);
    return {
      success: true,
      data: result.data,
      error: undefined,
    };
  });
};

export const deleteTasksByProjectId = (projectId: string) => {
  return Effect.gen(function* () {
    const service = yield* FirestoreService;
    const response = yield* service.getDocuments<Task>(COLLECTION.TASKS, {
      query: [
        { field: QUERY_PARAMS.PROJECT_ID, comparison: "==", value: projectId },
      ],
    });
    if (response.data.length === 0) {
      return {
        success: true,
        data: [],
        error: undefined,
      };
    }
    const { config } = yield* (yield* Config).getConfig;
    const batch = writeBatch(config);
    response.data.forEach((task) => {
      batch.delete(doc(config, COLLECTION.TASKS, task.id));
    });
    yield* Effect.tryPromise({
      try: () => batch.commit(),
      catch: (cause) => new FirestoreError({ cause }),
    });
    return {
      success: true,
      data: response.data,
      error: undefined,
    };
  });
};
