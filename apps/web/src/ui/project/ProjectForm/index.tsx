'use client';
import { useEffect, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import { Control, Controller, UseFormSetValue, useForm } from 'react-hook-form';

// Components
import { Button } from '@repo/ui/components/Button';
import { Text } from '@repo/ui/components/Text';
import { Input } from '@repo/ui/components/Input';
import { Checkbox } from '@repo/ui/components/Checkbox';
import { MultipleSelect } from '@repo/ui/components/MultipleSelect';

// Models
import { Project, ProjectFormState } from '@repo/db/models/projects';
import type { User } from '@repo/ui/types/users';
import {
  ProjectFormDataSchema,
  ProjectFormDataType,
  ProjectFormTypeWithMembers,
} from '@repo/db/models/schemas';

// Utils
import { generateSlug } from '@repo/ui/utils/slugs';
import { cn } from '@repo/ui/utils/styles';
import { isEmpty, setServerActionErrors } from '@repo/ui/utils/validators';
import { effectSchemaResolver } from '@repo/db/utils/form-handlers';

type ProjectFormProps = {
  memberOptions: User[];
  state: ProjectFormState;
  projectValue?: Project;
  participations?: string[];
  onSubmit: (formValues: ProjectFormTypeWithMembers) => void;
};

const ProjectFormContent = ({
  memberOptions,
  control,
  setValue,
  responseMessage,
  isDisabled,
  isCreated,
  isReadOnly = false,
}: {
  memberOptions: User[];
  control: Control<ProjectFormDataType>;
  setValue: UseFormSetValue<ProjectFormDataType>;
  responseMessage?: string;
  isDisabled: boolean;
  isCreated?: boolean;
  isReadOnly?: boolean;
}) => {
  const { pending } = useFormStatus();

  return (
    <div>
      <Controller
        name="title"
        control={control}
        render={({
          field: { onChange, value, ...rest },
          fieldState: { error },
        }) => (
          <div className="flex flex-col gap-2">
            <label className="font-bold text-md">Title*</label>
            <Input
              placeholder="Title"
              value={value}
              onChange={(value) => {
                onChange(value);
                setValue('slug', generateSlug(value.target.value), {
                  shouldValidate: true,
                });
              }}
              customClass="py-5"
              readOnly={isReadOnly}
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
        name="slug"
        control={control}
        render={({
          field: { onChange, value, ...rest },
          fieldState: { error },
        }) => (
          <div className="flex flex-col gap-2">
            <label className="font-bold text-md">Slug*</label>
            <Input
              placeholder="Slug"
              value={value}
              onChange={(value) => {
                onChange(value);
              }}
              readOnly={isReadOnly}
              disabled={pending}
              customClass="py-5"
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
        name="description"
        control={control}
        render={({
          field: { onChange, value, ...rest },
          fieldState: { error },
        }) => (
          <div className="flex flex-col gap-2">
            <label className="font-bold text-md">Description</label>
            <Input
              placeholder="Description"
              value={value}
              onChange={(value) => {
                onChange(value);
              }}
              customClass="py-5"
              readOnly={isReadOnly}
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
        name="memberIds"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => (
          <div className="flex flex-col gap-2">
            <label className="font-bold text-md">Members*</label>

            <MultipleSelect
              onChange={(value) => {
                onChange(value);
              }}
              options={memberOptions.map((member) => ({
                name: member.name,
                value: member.id,
              }))}
              selectedOptions={value}
              disabled={pending || isReadOnly}
              onBlur={onBlur}
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
        name="image"
        control={control}
        render={({
          field: { onChange, value, ...rest },
          fieldState: { error },
        }) => (
          <div className="flex flex-col gap-2">
            <label className="font-bold text-md">Image</label>
            <Input
              placeholder="Image"
              value={value}
              onChange={(value) => {
                onChange(value);
              }}
              customClass="py-5"
              readOnly={isReadOnly}
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
        name="isPublic"
        control={control}
        render={({
          field: { onChange, value, ...rest },
          fieldState: { error },
        }) => (
          <div className="flex flex-col gap-2">
            <Checkbox
              className="w-7 h-7"
              label="Public Project"
              checked={value}
              onChange={(e) => {
                onChange(e.target.checked);
              }}
              customClass={{
                label: 'text-md',
              }}
              disabled={pending || isReadOnly}
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
        customClass="w-full justify-center py-[19px] font-bold mb-8"
        disabled={isDisabled || isReadOnly}
        isLoading={pending}
      >
        {isCreated ? 'Create' : 'Edit'} Project
      </Button>
      <span className={cn('mt-3', responseMessage ? 'mb-2' : 'mb-8')}>
        {responseMessage && (
          <Text
            customClass="text-xs px-0 whitespace-pre"
            value={responseMessage}
            variant="error"
          />
        )}
      </span>
    </div>
  );
};

export const ProjectForm = ({
  memberOptions,
  state,
  projectValue,
  participations,
  onSubmit,
}: ProjectFormProps) => {
  const { title, description, slug, image, isPublic, isArchived } =
    projectValue || {};

  const projectFormInitValues: ProjectFormDataType = useMemo(
    () => ({
      title: title || '',
      slug: slug || '',
      description: description || '',
      image: image || '',
      isPublic: isPublic !== undefined ? isPublic : true,
      memberIds: participations || [],
    }),
    [title, slug, description, image, isPublic, participations],
  );

  const {
    control,
    setError,
    getValues,
    setValue,
    reset,
    formState: { isDirty, isLoading },
  } = useForm<ProjectFormDataType>({
    mode: 'onBlur',
    values: projectFormInitValues,
    resolver: effectSchemaResolver(ProjectFormDataSchema),
  });

  const isDisabled = !isDirty || isLoading;

  const handleSubmit = () => {
    const formValues = getValues();
    onSubmit({
      ...formValues,
      members: memberOptions.filter((member) =>
        getValues('memberIds').includes(member.id),
      ),
    });
  };

  useEffect(() => {
    if (state.formErrors) {
      setServerActionErrors(state.formErrors, setError);
    }
  }, [state.formErrors, setError]);

  useEffect(() => {
    if (!isEmpty(projectValue)) {
      reset(projectFormInitValues);
    }
  }, [projectFormInitValues, projectValue, reset]);

  return (
    <form className="dark:text-white" action={handleSubmit}>
      <ProjectFormContent
        memberOptions={memberOptions}
        control={control}
        setValue={setValue}
        isDisabled={isDisabled}
        responseMessage={state?.error}
        isCreated={isEmpty(projectValue)}
        isReadOnly={isArchived}
      />
    </form>
  );
};
