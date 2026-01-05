import { unstable_cache as cache } from 'next/cache';
import { Effect } from 'effect';

// Constants
import { TAGS } from '@repo/ui/constants/tags';

// DB
import { queryParticipatorsByProjectId } from '@repo/db/firebase/participations';

// Models
import { Participation } from '@repo/db/models/participations';

// Types
import { CacheOption } from '@repo/ui/types/cache';
import { ResponseStateType } from '@repo/ui/types/responses';

// Services
import { AuthService } from '@/services/auth-services';
import { MainLive, ServiceLive } from '@/services/main-live';

// Utils
import { getErrorMessage } from '@repo/db/utils/form-handlers';

export const getParticipatorsByProjectId = async (
  projectId: string,
  cacheOptions?: CacheOption,
): Promise<ResponseStateType<Participation[]>> => {
  const program = Effect.gen(function* () {
    const session = yield* (yield* AuthService).getSession;
    let result;
    if (session) {
      result = yield* Effect.fromNullable(
        yield* queryParticipatorsByProjectId(projectId),
      );
    } else {
      const cachedGetParticipators = cache(
        async (projectId: string) => {
          const effectProgram = queryParticipatorsByProjectId(projectId);
          const runnable = effectProgram.pipe(Effect.provide(ServiceLive));
          const result = await Effect.runPromise(runnable);
          return result;
        },
        [TAGS.PROJECT_DETAIL(projectId), ...(cacheOptions?.keyParts || [])],
        cacheOptions?.options,
      );
      result = yield* Effect.promise(() => cachedGetParticipators(projectId));
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
