// Models
import { CustomStateType } from "./responses";

export type UserSigninState = {
  formErrors?: {
    username?: string[];
    password?: string[];
  };
  responseMessage?: string;
} & CustomStateType;

export type UserSignUpState = {
  formErrors?: {
    password?: string;
    passwordConfirmation?: string;
  };
  responseMessage?: string;
} & UserSigninState &
  CustomStateType;
