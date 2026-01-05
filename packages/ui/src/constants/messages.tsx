export const ERROR_MESSAGES = {
  FIELD_REQUIRED: "This field is required.",
  FORMAT: (label: string) => `${label} does not follow the correct format.`,
  PASSWORD_NOT_MATCH:
    "Your password confirmation did not match your password. Please try again.",
  PASSWORD_NOT_MATCH_REGEX: `Password must contain at least:
    * One uppercase letter
    * One lowercase letter
    * One number
    `,
  MIN_LENGTH: (label: string, minLength: number | string) =>
    `${label} must have minimum ${minLength} characters.`,
  USER_NOT_FOUND: "User not found.",
  UNAUTHORIZED_ACCESS:
    "Unauthorized. Access is denied due to invalid credentials",
  REQUESTING_DATA: "An error occurred when requesting data.",
  UPSERTING_DATA_ERROR: (label: string) =>
    `An error occurred when upserting data into ${label} collection`,
  DATA_NOT_FOUND: "Not found",
  PROJECT_IS_ARCHIVED: "The project is archived. Cannot update contents.",
  GENERAL_ERROR: "An error occurred. Please try again later.",
};

export const ERROR_CODE = {
  EMAIL_EXIST: "auth/email-already-in-use",
};

export const SUCCESS_MESSAGES = {
  REMOVE_PROJECT: "Remove Project Successfully.",
  ARCHIVE_PROJECT: "Archive Project Successfully.",
  UNARCHIVE_PROJECT: "Unarchive Project Successfully.",
  EDIT_PARTICIPANTS: "Edit Participants Successfully.",
  SIGNED_IN: "Signed In Successfully. Redirecting to HomePage.",
  SIGNED_OUT: "Signed Out. Redirecting ... ",
};
