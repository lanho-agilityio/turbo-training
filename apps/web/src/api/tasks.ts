import { unstable_cache as cache } from 'next/cache';
import { Effect } from 'effect';

// Constants
import { COLLECTION } from '@repo/ui/constants/collection';
import { TAGS } from '@repo/ui/constants/tags';
import { ERROR_MESSAGES } from '@repo/ui/constants/messages';

// DB
import { countTaskByType, getTaskDetailById } from '@repo/db/firebase/tasks';
import { FirestoreService } from '@repo/db/firebase/query';

// Models
import {
  Task,
  TaskStatisticQueryParam,
  TaskStatisticResponse,
} from '@repo/db/models/tasks';

// Types
import { CacheOption } from '@repo/ui/types/cache';
import { ResponseStateType } from '@repo/ui/types/responses';
import { QueryParam } from '@repo/ui/types/query-params';

// Services
import { AuthService } from '@/services/auth-services';
import { MainLive, ServiceLive } from '@/services/main-live';
import { getErrorMessage } from '@repo/db/utils/form-handlers';

export const getTasks = async (
  queryParam?: QueryParam,
): Promise<ResponseStateType<Task[]>> => {
  const program = Effect.gen(function* () {
    const session = yield* (yield* AuthService).getSession;
    const service = yield* FirestoreService;
    let result;
    if (session) {
      result = yield* service.getDocuments<Task>(COLLECTION.TASKS, queryParam);
    } else {
      const cachedGetTasks = cache(
        async () => {
          const res = await Effect.runPromise(
            service.getDocuments<Task>(COLLECTION.TASKS, queryParam),
          );
          return res;
        },
        [JSON.stringify({ tag: TAGS.TASK_LIST, queryParam })],
        {
          tags: [
            TAGS.TASK_LIST,
            JSON.stringify({ tag: TAGS.TASK_LIST, queryParam }),
          ],
        },
      );
      result = yield* Effect.promise(() => cachedGetTasks());
    }
    return {
      success: true,
      data: result.data,
      total: result.total,
      error: undefined,
    };
  });
  const runnable = program.pipe(Effect.provide(MainLive));
  return await Effect.runPromise(
    runnable.pipe(
      Effect.catchAll((error) =>
        Effect.succeed({
          success: false,
          data: [],
          total: 0,
          error: getErrorMessage(error),
        }),
      ),
    ),
  );
};

export const getTaskById = async (
  id: string,
): Promise<ResponseStateType<Task | null>> => {
  const program = Effect.gen(function* () {
    const session = yield* (yield* AuthService).getSession;
    let result;
    if (session) {
      result = yield* Effect.fromNullable(yield* getTaskDetailById(id));
    } else {
      const cachedGetTask = cache(
        async (taskId: string) => {
          const effectProgram = getTaskDetailById(taskId);
          const runnable = effectProgram.pipe(Effect.provide(ServiceLive));
          const result = await Effect.runPromise(runnable);
          return result;
        },
        [TAGS.TASK_DETAIL(id)],
        {
          tags: [TAGS.TASK_DETAIL(id)],
        },
      );
      result = yield* Effect.promise(() => cachedGetTask(id));
    }
    if (!result.success || !result.data) {
      return {
        success: false,
        data: null,
        error: ERROR_MESSAGES.DATA_NOT_FOUND,
      };
    }
    return {
      success: true,
      data: result.data,
      error: undefined,
    };
  });
  const runnable = program.pipe(Effect.provide(MainLive));
  return await Effect.runPromise(
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
};

export const getTaskStatistic = async (
  stats: TaskStatisticQueryParam[],
  cacheOptions?: CacheOption,
): Promise<ResponseStateType<TaskStatisticResponse[]>> => {
  const program = Effect.gen(function* () {
    const session = yield* (yield* AuthService).getSession;
    const userId = session?.user?.id;
    const taskStat: TaskStatisticResponse[] = [];
    yield* Effect.all(
      stats.map((type) =>
        Effect.gen(function* () {
          let response;
          if (userId) {
            response = yield* Effect.fromNullable(
              yield* countTaskByType(type.field, type.value, userId),
            );
          } else {
            const cachedCount = cache(
              async (field: string, value: string) => {
                const effectProgram = countTaskByType(field, value);
                const runnable = effectProgram.pipe(Effect.provide(MainLive));
                const result = await Effect.runPromise(runnable);
                return result;
              },
              [TAGS.TASK_LIST, ...(cacheOptions?.keyParts || [])],
              cacheOptions?.options,
            );
            response = yield* Effect.promise(() =>
              cachedCount(type.field, type.value),
            );
          }

          if (response?.total !== undefined) {
            taskStat.push({
              label: response.data,
              total: response.total,
            });
          }
        }),
      ),
      { concurrency: 'unbounded' },
    );

    return {
      success: true,
      data: taskStat,
      error: undefined,
    };
  });
  const runnable = program.pipe(Effect.provide(MainLive));
  return await Effect.runPromise(
    runnable.pipe(
      Effect.catchAll((error) =>
        Effect.succeed({
          success: false,
          data: [],
          error: getErrorMessage(error),
        }),
      ),
    ),
  );
};
