'use client';

import { useEffect, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import { Control, Controller, UseFormSetValue, useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';

// Components
import { Button } from '@repo/ui/components/Button';
import { Text } from '@repo/ui/components/Text';
import { Input } from '@repo/ui/components/Input';
import { Dropdown } from '@repo/ui/components/Dropdown';

// Constants
import { DATE_FORMAT } from '@repo/ui/constants/dates';
import { QUERY_PARAMS } from '@repo/ui/constants/queryParams';
import {
  TASK_STATUS_OPTIONS,
  TASK_PRIORITY_OPTIONS,
} from '@repo/ui/constants/tasks';

// Models
import { Task, TaskFormState } from '@repo/db/models/tasks';
import { Project } from '@repo/db/models/projects';
import { Participation } from '@repo/db/models/participations';
import { TaskFormDataType, TaskFormDataSchema } from '@repo/db/models/schemas';

// Utils
import { formatDate } from '@repo/ui/utils/dates';
import { generateSlug } from '@repo/ui/utils/slugs';
import { cn } from '@repo/ui/utils/styles';
import { isEmpty, setServerActionErrors } from '@repo/ui/utils/validators';
import { effectSchemaResolver } from '@repo/db/utils/form-handlers';

type TaskFormProps = {
  assignedToOptions: Participation[];
  fromProject: Project;
  taskValue?: Task;
  state: TaskFormState;
  isReadOnly?: boolean;
  onSubmit: (formValues: TaskFormDataType) => void;
};

type TaskFormContentType = {
  assignedToOptions: Participation[];
  fromProject: Project;
  control: Control<TaskFormDataType>;
  setValue: UseFormSetValue<TaskFormDataType>;
  responseMessage?: string;
  isDisabled: boolean;
  isCreated?: boolean;
  isReadOnly?: boolean;
};

const TaskFormContent = ({
  assignedToOptions,
  fromProject,
  control,
  setValue,
  responseMessage,
  isDisabled,
  isCreated,
  isReadOnly,
}: TaskFormContentType) => {
  const { pending } = useFormStatus();
  const isDisable = pending || isReadOnly;

  return (
    <div>
      <div className="flex flex-col gap-2 mb-8">
        <label className="font-bold text-md ">Project</label>
        <Input readOnly value={fromProject.title} disabled customClass="py-5" />
        <div />
      </div>

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
              disabled={isDisable}
              placeholder="Title"
              value={value}
              onChange={(value) => {
                onChange(value);
                setValue('slug', generateSlug(value.target.value), {
                  shouldValidate: true,
                });
              }}
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
        name="slug"
        control={control}
        render={({
          field: { onChange, value, ...rest },
          fieldState: { error },
        }) => (
          <div className="flex flex-col gap-2">
            <label className="font-bold text-md">Slug*</label>
            <Input
              disabled={isDisable}
              placeholder="Slug"
              value={value}
              onChange={(value) => {
                onChange(value);
              }}
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
              disabled={isDisable}
              placeholder="Description"
              value={value}
              onChange={(value) => {
                onChange(value);
              }}
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
        name="image"
        control={control}
        render={({
          field: { onChange, value, ...rest },
          fieldState: { error },
        }) => (
          <div className="flex flex-col gap-2">
            <label className="font-bold text-md">Image</label>
            <Input
              disabled={isDisable}
              placeholder="Image"
              value={value}
              onChange={(value) => {
                onChange(value);
              }}
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
      <div className="flex flex-col sm:flex-row sm:gap-4">
        <Controller
          name="status"
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <div className="flex flex-col gap-2 basis-1/2">
              <label className="font-bold text-md">Status*</label>
              <Dropdown
                disabled={isDisable}
                placeholder="Status"
                options={TASK_STATUS_OPTIONS}
                selectedItemValue={value}
                onSelect={(value) => {
                  onChange(value);
                }}
                onBlur={onBlur}
                customClass={{
                  button: 'w-full',
                }}
              />
              <span
                className={cn(
                  'bg-transparent',
                  error?.message ? 'mb-2' : 'mb-8',
                )}
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
          name="priority"
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <div className="flex flex-col gap-2 basis-1/2 z-10">
              <label className="font-bold text-md">Priority*</label>
              <Dropdown
                disabled={isDisable}
                placeholder="Priority"
                options={TASK_PRIORITY_OPTIONS}
                selectedItemValue={value}
                onSelect={(value) => {
                  onChange(value);
                }}
                onBlur={onBlur}
                customClass={{
                  button: 'w-full',
                }}
              />
              <span
                className={cn(
                  'bg-transparent',
                  error?.message ? 'mb-2' : 'mb-8',
                )}
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
      </div>

      <Controller
        name="assignedTo"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => (
          <div className="flex flex-col gap-2">
            <label className="font-bold text-md">Assigned To*</label>
            <Dropdown
              disabled={isDisable}
              placeholder="Assigned To User"
              options={assignedToOptions.map((user) => ({
                name: user.name,
                value: user.userId,
              }))}
              selectedItemValue={value}
              onSelect={(value) => {
                onChange(value);
              }}
              onBlur={onBlur}
              customClass={{
                button: 'w-full',
              }}
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
        name="dueDate"
        control={control}
        render={({
          field: { onChange, value, ...rest },
          fieldState: { error },
        }) => (
          <div className="flex flex-col gap-2">
            <label className="font-bold text-md">Due Date*</label>
            <Input
              disabled={isDisable}
              placeholder="Due Date"
              type="date"
              value={formatDate(value, DATE_FORMAT.Tertiary)}
              onChange={(e) => {
                onChange(new Date(e.target.value));
              }}
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
      {!isReadOnly && (
        <Button
          type="submit"
          customClass="w-full justify-center py-[19px] font-bold mb-8"
          disabled={isDisabled}
          isLoading={pending}
        >
          {isCreated ? 'Create' : 'Edit'} Task
        </Button>
      )}

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

export const TaskForm = ({
  assignedToOptions,
  fromProject,
  taskValue,
  state,
  isReadOnly,
  onSubmit,
}: TaskFormProps) => {
  const searchParams = useSearchParams();
  const searchParamProjectId = searchParams.get(QUERY_PARAMS.PROJECT_ID) || '';
  const searchParamStatus = searchParams.get(QUERY_PARAMS.STATUS) || '';

  const {
    title,
    slug,
    description,
    image,
    status,
    priority,
    assignedTo,
    projectId,
    dueDate,
  } = taskValue || {};

  const taskFormInitValues: TaskFormDataType = useMemo(
    () => ({
      title: title || '',
      slug: slug || '',
      description: description || '',
      image: image || '',
      status: status || searchParamStatus,
      priority: priority || '',
      assignedTo: assignedTo || '',
      projectId: projectId || searchParamProjectId,
      dueDate: (dueDate && new Date(dueDate)) || new Date(),
    }),
    [
      title,
      slug,
      description,
      image,
      dueDate,
      status,
      priority,
      assignedTo,
      projectId,
      searchParamProjectId,
      searchParamStatus,
    ],
  );

  const {
    control,
    setError,
    getValues,
    reset,
    setValue,
    formState: { isDirty, isLoading },
  } = useForm<TaskFormDataType>({
    mode: 'onBlur',
    values: taskFormInitValues,
    resolver: effectSchemaResolver(TaskFormDataSchema),
  });

  const isDisabled = !isDirty || isLoading;

  const handleSubmit = () => {
    const formValues = getValues();
    onSubmit(formValues);
  };

  useEffect(() => {
    if (state.formErrors) {
      setServerActionErrors(state.formErrors, setError);
    }
  }, [state.formErrors, setError]);

  useEffect(() => {
    if (!isEmpty(taskValue)) {
      reset(taskFormInitValues);
    }
  }, [taskFormInitValues, taskValue, reset]);

  return (
    <form className="dark:text-white" action={handleSubmit}>
      <TaskFormContent
        assignedToOptions={assignedToOptions}
        fromProject={fromProject}
        control={control}
        setValue={setValue}
        responseMessage={state?.error}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isCreated={isEmpty(taskValue)}
      />
    </form>
  );
};
