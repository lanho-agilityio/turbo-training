'use client';
import { useEffect, useActionState } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';

// APIs
import { userSignUp } from '@/actions/authentication';

// Components
import { Button } from '@repo/ui/components/Button';
import { Text } from '@repo/ui/components/Text';
import { Input } from '@repo/ui/components/Input';
import { InputPassword } from '@repo/ui/components/InputPassword';

// Constants
import { ROUTES } from '@repo/ui/constants/routes';

// Types
import type { UserSignUpState } from '@repo/ui/types/authentications';
import {
  UserSignupFormDataSchema,
  UserSignupFormDataType,
} from '@repo/db/models/schemas';

// Utils
import { cn } from '@repo/ui/utils/styles';
import { setServerActionErrors } from '@repo/ui/utils/validators';
import { effectSchemaResolver } from '@repo/db/utils/form-handlers';

const SignUpFormContent = ({
  control,
  state,
  isDisabled,
}: {
  control: Control<UserSignupFormDataType>;
  state: UserSignUpState;
  isDisabled: boolean;
}) => {
  const { pending } = useFormStatus();

  return (
    <div className="dark:text-white">
      <Controller
        name="username"
        control={control}
        render={({
          field: { onChange, value, ...rest },
          fieldState: { error },
        }) => (
          <div className="flex flex-col gap-2">
            <label className="font-bold text-md">Username</label>
            <Input
              placeholder="Input your username here"
              value={value}
              onChange={(value) => {
                onChange(value);
              }}
              customClass="py-5"
              disabled={pending}
              {...rest}
            />
            <span
              className={cn('bg-transparent', error?.message ? 'mb-2' : 'mb-8')}
            >
              {error?.message && (
                <Text
                  customClass="text-xs px-0 whitespace-pre"
                  value={error?.message}
                  variant="error"
                />
              )}
            </span>
          </div>
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({
          field: { onChange, value, ...rest },
          fieldState: { error },
        }) => (
          <div className="flex flex-col gap-2">
            <label className="font-bold text-md">Email</label>
            <Input
              placeholder="Input your email here"
              value={value}
              onChange={(value) => {
                onChange(value);
              }}
              customClass="py-5"
              disabled={pending}
              {...rest}
            />
            <span
              className={cn('bg-transparent', error?.message ? 'mb-2' : 'mb-8')}
            >
              {error?.message && (
                <Text
                  customClass="text-xs px-0 whitespace-pre"
                  value={error?.message}
                  variant="error"
                />
              )}
            </span>
          </div>
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({
          field: { onChange, value, ...rest },
          fieldState: { error },
        }) => (
          <div className="flex flex-col gap-2">
            <label className="font-bold text-md">Password</label>
            <InputPassword
              placeholder="Input password here"
              value={value}
              onChange={onChange}
              customClass="py-5"
              disabled={pending}
              {...rest}
            />
            <span
              className={cn('bg-transparent', error?.message ? 'mb-2' : 'mb-8')}
            >
              {error?.message && (
                <Text
                  customClass="text-xs px-0 whitespace-pre"
                  value={error?.message}
                  variant="error"
                />
              )}
            </span>
          </div>
        )}
      />
      <Controller
        name="passwordConfirmation"
        control={control}
        render={({
          field: { onChange, value, ...rest },
          fieldState: { error },
        }) => (
          <div className="flex flex-col gap-2">
            <label className="font-bold text-md">Re-enter your password</label>
            <InputPassword
              placeholder="Re-enter your password here"
              value={value}
              onChange={onChange}
              customClass="py-5"
              disabled={pending}
              {...rest}
            />
            <span
              className={cn('bg-transparent', error?.message ? 'mb-2' : 'mb-8')}
            >
              {error?.message && (
                <Text
                  customClass="text-xs px-0 whitespace-pre"
                  value={error?.message}
                  variant="error"
                />
              )}
            </span>
          </div>
        )}
      />
      <Button
        type="submit"
        customClass="w-full justify-center py-[19px] font-bold"
        disabled={isDisabled}
        isLoading={pending}
      >
        Sign Up
      </Button>
      <div className="flex flex-col mt-3">
        <span className={cn(state.responseMessage ? 'mb-2' : 'mb-8')}>
          {state.responseMessage && (
            <Text
              customClass="text-xs px-0 whitespace-pre"
              value={state.responseMessage}
              variant={state.success ? 'primary' : 'error'}
            />
          )}
        </span>
        <span>
          Have an account?&nbsp;
          <Link
            className="text-lg font-bold hover:text-blue-700 cursor-pointer"
            href={ROUTES.SIGN_IN}
          >
            Login Now
          </Link>
        </span>
      </div>
    </div>
  );
};

export const SignUpForm = () => {
  const signUpFormInitValues: UserSignupFormDataType = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  };

  const {
    control,
    setError,
    getValues,
    formState: { isDirty, isLoading },
  } = useForm<UserSignupFormDataType>({
    mode: 'onBlur',
    values: signUpFormInitValues,
    resolver: effectSchemaResolver(UserSignupFormDataSchema),
  });

  const isDisabled = !isDirty || isLoading;

  const initialState = { message: null, formErrors: {} };
  const [state, dispatch] = useActionState(userSignUp, initialState);

  useEffect(() => {
    if (state.formErrors) {
      setServerActionErrors(state.formErrors, setError);
    }
  }, [state.formErrors, setError]);

  const handleSubmit = () => {
    const formValues = getValues();
    dispatch(formValues);
  };
  return (
    <form action={handleSubmit}>
      <SignUpFormContent
        control={control}
        state={state}
        isDisabled={isDisabled}
      />
    </form>
  );
};
