'use server';
import { Effect } from 'effect';

// DB
import { fetchUserList } from '@repo/db/firebase/users';
import { ServiceLive } from '@/services/main-live';
import { getErrorMessage } from '@repo/db/utils/form-handlers';

export const queryUserList = async () => {
  const program = fetchUserList();
  const runnable = program.pipe(Effect.provide(ServiceLive));
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
