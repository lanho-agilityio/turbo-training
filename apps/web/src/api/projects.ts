import { unstable_cache as cache } from 'next/cache';
import { documentId } from 'firebase/firestore';
import { Effect } from 'effect';

// Constants
import { QUERY_PARAMS } from '@repo/ui/constants/queryParams';
import { COLLECTION } from '@repo/ui/constants/collection';
import { TAGS } from '@repo/ui/constants/tags';
import { ERROR_MESSAGES } from '@repo/ui/constants/messages';

// DB
import { getProjectDetail } from '@repo/db/firebase/projects';
import { queryAssignedProjectsByUserId } from '@repo/db/firebase/participations';
import { FirestoreService } from '@repo/db/firebase/query';

// Models
import { Project } from '@repo/db/models/projects';
import { ProjectNotFound } from '@repo/db/models/base';

// Type
import { CacheOption } from '@repo/ui/types/cache';
import { QueryFilter, QueryParam } from '@repo/ui/types/query-params';
import { ResponseStateType } from '@repo/ui/types/responses';

// Services
import { AuthService } from '@/services/auth-services';
import { MainLive, ServiceLive } from '@/services/main-live';
import { getErrorMessage } from '@repo/db/utils/form-handlers';

export const getProjectList = async (
  queryParam?: QueryParam,
): Promise<ResponseStateType<Project[]>> => {
  const program = Effect.gen(function* () {
    const session = yield* (yield* AuthService).getSession;
    const service = yield* FirestoreService;
    let result;
    if (session) {
      const updatedQueryParam = { ...queryParam };
      if (updatedQueryParam?.query) {
        const filterByUserIndex = updatedQueryParam.query.findIndex(
          (filter: QueryFilter) => filter.field === QUERY_PARAMS.FILTER_BY_USER,
        );
        if (filterByUserIndex !== -1) {
          const participationResponse = yield* queryAssignedProjectsByUserId(
            session.user.id,
          );
          const projectIds = participationResponse.data.map((p) => p.projectId);
          if (projectIds.length > 0) {
            updatedQueryParam.query[filterByUserIndex] = {
              field: documentId(),
              comparison: 'in',
              value: projectIds,
            };
          } else {
            updatedQueryParam.query = updatedQueryParam.query.filter(
              (_, i) => i !== filterByUserIndex,
            );
          }
        }
      }
      result = yield* service.getDocuments<Project>(
        COLLECTION.PROJECTS,
        updatedQueryParam,
      );
    } else {
      const cachedGetProjects = cache(
        async (queryParam?: QueryParam) => {
          const res = await Effect.runPromise(
            service.getDocuments<Project>(COLLECTION.PROJECTS, queryParam),
          );
          return res;
        },
        [TAGS.PROJECT_LIST, JSON.stringify(queryParam)],
        {
          tags: [TAGS.PROJECT_LIST],
        },
      );
      result = yield* Effect.promise(() => cachedGetProjects(queryParam));
    }
    return {
      success: true,
      data: result.data,
      total: result.total,
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

export const getProjectById = async (
  id: string,
  cacheOptions?: CacheOption,
): Promise<ResponseStateType<Project | null>> => {
  const program = Effect.gen(function* () {
    const session = yield* (yield* AuthService).getSession;
    let result;
    if (session) {
      result = yield* getProjectDetail(id);
    } else {
      const cachedGetProject = cache(
        async (id: string) => {
          const effectProgram = getProjectDetail(id);
          const runnable = effectProgram.pipe(Effect.provide(ServiceLive));
          const result = await Effect.runPromise(runnable);
          return result;
        },
        [TAGS.PROJECT_DETAIL(id), ...(cacheOptions?.keyParts || [])],
        cacheOptions?.options,
      );
      result = yield* Effect.promise(() => cachedGetProject(id));
    }
    if (!result.success || !result.data) {
      return yield* Effect.fail(new ProjectNotFound());
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
