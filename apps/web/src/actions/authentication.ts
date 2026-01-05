'use server';

import { redirect } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Effect } from 'effect';

// Configs
import { firebaseAuth, db } from '@/config/firebaseConfig';

// Constants
import { COLLECTION } from '@repo/ui/constants/collection';
import { ERROR_CODE } from '@repo/ui/constants/messages';
import { ROUTES } from '@repo/ui/constants/routes';

// Types
import { UserSignUpState } from '@repo/ui/types/authentications';
import {
  UserSignupFormDataSchema,
  UserSignupFormDataType,
} from '@repo/db/models/schemas';
import { EmailExists, FirestoreError } from '@repo/db/models/base';

// Utils
import { effectSafeParse, getErrorMessage } from '@repo/db/utils/form-handlers';

export async function userSignUp(
  prevState: UserSignUpState,
  formData: UserSignupFormDataType,
): Promise<UserSignUpState> {
  const parseResult = await effectSafeParse(UserSignupFormDataSchema, formData);
  if (!parseResult.success || !parseResult.data) {
    return {
      success: false,
      formErrors: parseResult.errors,
    };
  }
  const { username, email, password } = parseResult.data;
  const program = Effect.gen(function* () {
    const credential = yield* Effect.tryPromise({
      try: () => createUserWithEmailAndPassword(firebaseAuth, email, password),
      catch: (error) => {
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes(ERROR_CODE.EMAIL_EXIST)) {
          return new EmailExists();
        }
        return new FirestoreError({ cause: error });
      },
    });
    yield* Effect.tryPromise({
      try: () =>
        setDoc(doc(db, COLLECTION.USERS, credential.user.uid), {
          username,
          email,
        }),
      catch: (error) => {
        return new FirestoreError({ cause: error });
      },
    });

    return {
      success: true,
      formErrors: undefined,
    };
  }).pipe(
    Effect.catchAll((error) =>
      Effect.succeed({
        success: false,
        responseMessage: getErrorMessage(error),
      }),
    ),
  );
  const result = await Effect.runPromise(program);
  if (result.success) {
    redirect(ROUTES.SIGN_IN);
  }
  return result;
}
