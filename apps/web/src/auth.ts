import { signInWithEmailAndPassword } from 'firebase/auth';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { doc, getDoc } from 'firebase/firestore';

// Constants
import { COLLECTION } from '@repo/ui/constants/collection';
import { ROUTES } from '@repo/ui/constants/routes';

// Configs
import { db, firebaseAuth } from '@/config/firebaseConfig';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            return null;
          }
          const { email, password } = credentials;
          const signInResponse = await signInWithEmailAndPassword(
            firebaseAuth,
            email,
            password,
          );
          if (!signInResponse.user) {
            return null;
          }
          const userId = signInResponse.user.uid;
          const userData = await getDoc(doc(db, COLLECTION.USERS, userId));
          if (userData.exists()) {
            return {
              id: userId,
              name: userData.data().username,
              email: userData.data().email,
            };
          }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    // Session expires
    maxAge: 24 * 60 * 60, // 24 hours
    strategy: 'jwt',
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        if (token?.sub) {
          session.user.id = token.sub;
        }
        if (token?.name) {
          session.user.name = token.name;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: ROUTES.SIGN_IN,
  },
};
