import { Context, Effect, Layer } from 'effect';

// Auth
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/auth';

// Constants
import { UnauthorizedAccess } from '@repo/db/models/base';

export class AuthService extends Context.Tag('AuthService')<
  AuthService,
  {
    readonly getSession: Effect.Effect<
      Session | null,
      UnauthorizedAccess,
      never
    >;
  }
>() {}

export const AuthServiceLive = Layer.succeed(AuthService, {
  getSession: Effect.tryPromise({
    try: () => getServerSession(authOptions),
    catch: () => new UnauthorizedAccess(),
  }),
});
