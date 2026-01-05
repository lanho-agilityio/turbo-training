import { DefaultSession, User } from 'next-auth';
import { DefaultJWT } from "next-auth/jwt"

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}
