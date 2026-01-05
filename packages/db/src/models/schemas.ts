import { Schema } from "effect";

// Constants
import { REGEX_EMAIL } from "@repo/ui/constants/regex";
import { ERROR_MESSAGES } from "@repo/ui/constants/messages";
import { MIN_LENGTH } from "@repo/ui/constants/formConstraints";

// Utils
import { generatePasswordRegex } from "@repo/ui/utils/password";
import { User } from "@repo/ui/types/users";

export const FIELD_DATA_SCHEMA = {
  USER_NAME: "Username",
  EMAIL: "Email",
  PASSWORD: "Password",
  PASSWORD_CONFIRMATION: "passwordConfirmation",
};

const isRequiredString = Schema.String.pipe(
  Schema.filter((value: string): boolean => value.trim().length > 0, {
    message: () => ERROR_MESSAGES.FIELD_REQUIRED,
    identifier: "RequiredString",
  })
);

const usernameSchema = Schema.String.pipe(
  Schema.minLength(MIN_LENGTH.USERNAME, {
    message: () =>
      ERROR_MESSAGES.MIN_LENGTH(
        FIELD_DATA_SCHEMA.USER_NAME,
        MIN_LENGTH.USERNAME
      ),
  })
);

const emailSchema = Schema.String.pipe(
  Schema.filter((s) => s.trim().length > 0, {
    message: () => ERROR_MESSAGES.FIELD_REQUIRED,
  }),
  Schema.filter((s) => REGEX_EMAIL.test(s), {
    message: () => ERROR_MESSAGES.FORMAT(FIELD_DATA_SCHEMA.EMAIL),
  })
);

export const UserSigninFormDataSchema = Schema.Struct({
  email: isRequiredString,
  password: isRequiredString,
});

export const UserSignupFormDataSchema = Schema.Struct({
  username: usernameSchema,
  email: emailSchema,
  password: Schema.String.pipe(
    Schema.minLength(MIN_LENGTH.PASSWORD, {
      message: () =>
        ERROR_MESSAGES.MIN_LENGTH(
          FIELD_DATA_SCHEMA.PASSWORD,
          MIN_LENGTH.PASSWORD
        ),
    }),
    Schema.filter((s) => generatePasswordRegex(8).test(s), {
      message: () => ERROR_MESSAGES.PASSWORD_NOT_MATCH_REGEX,
    })
  ),
  passwordConfirmation: isRequiredString,
}).pipe(
  Schema.filter((data) => data.password === data.passwordConfirmation, {
    message: () => ERROR_MESSAGES.PASSWORD_NOT_MATCH,
    annotation: {
      identifier: FIELD_DATA_SCHEMA.PASSWORD_CONFIRMATION,
    },
  })
);

export const ProjectFormDataSchema = Schema.Struct({
  title: isRequiredString,
  slug: isRequiredString,
  description: Schema.String,
  image: Schema.UndefinedOr(
    Schema.String.pipe(
      Schema.pattern(/^(?:$|https?:\/\/.+)/, {
        message: () => "Invlid URL",
      })
    )
  ),
  isPublic: Schema.Boolean,
  memberIds: Schema.mutable(
    Schema.Array(Schema.String).pipe(
      Schema.minItems(1, { message: () => ERROR_MESSAGES.FIELD_REQUIRED })
    )
  ),
});

export const TaskFormDataSchema = Schema.Struct({
  title: isRequiredString,
  slug: isRequiredString,
  description: Schema.String,
  image: Schema.UndefinedOr(
    Schema.String.pipe(
      Schema.pattern(/^(?:$|https?:\/\/.+)/, {
        message: () => "Invlid URL",
      })
    )
  ),
  dueDate: Schema.instanceOf(Date),
  status: isRequiredString,
  priority: isRequiredString,
  assignedTo: isRequiredString,
  projectId: isRequiredString,
});

export const ParticipationFormDataSchema = Schema.Struct({
  memberIds: Schema.mutable(
    Schema.Array(Schema.String).pipe(
      Schema.minItems(1, { message: () => ERROR_MESSAGES.FIELD_REQUIRED })
    )
  ),
});

export type UserSigninFormDataType = Schema.Schema.Type<
  typeof UserSigninFormDataSchema
>;
export type UserSignupFormDataType = Schema.Schema.Type<
  typeof UserSignupFormDataSchema
>;
export type TaskFormDataType = Schema.Schema.Type<typeof TaskFormDataSchema>;
export type ProjectFormDataType = Schema.Schema.Type<
  typeof ProjectFormDataSchema
>;
export type ParticipationFormDataType = Schema.Schema.Type<
  typeof ParticipationFormDataSchema
>;

export type ParticipationFormTypeWithMembers = ParticipationFormDataType & {
  members: User[];
};

export type ProjectFormTypeWithMembers = ProjectFormDataType & {
  members: User[];
};
