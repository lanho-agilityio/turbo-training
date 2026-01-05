import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

// Actions
import { editParticipants } from '@/actions/participations';

// Components
import { BaseModal } from '@repo/ui/components/BaseModal';
import { Button } from '@repo/ui/components/Button';
import { MultipleSelect } from '@repo/ui/components/MultipleSelect';
import { Text } from '@repo/ui/components/Text';

// Constants
import { SUCCESS_MESSAGES } from '@repo/ui/constants/messages';

// HOCs
import { TWithToast, withToast } from '@repo/ui/hocs/withToast';

// Types
import type { User } from '@repo/ui/types/users';
import {
  ParticipationFormDataSchema,
  ParticipationFormDataType,
} from '@repo/db/models/schemas';

// Utils
import { cn } from '@repo/ui/utils/styles';
import { setServerActionErrors, isEmpty } from '@repo/ui/utils/validators';
import { effectSchemaResolver } from '@repo/db/utils/form-handlers';

type EditParticipantModalBaseProps = {
  projectId: string;
  memberOptions: User[];
  participations: string[];
  isOpen: boolean;
  setModalState: (value: boolean) => void;
};

const EditParticipantModalBase = ({
  projectId,
  memberOptions,
  participations,
  isOpen,
  setModalState,
  openToast,
}: TWithToast<EditParticipantModalBaseProps>) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);

  const participantsFormInitValues: ParticipationFormDataType = useMemo(
    () => ({
      memberIds: participations || [],
    }),
    [participations],
  );

  const {
    control,
    setError,
    handleSubmit: submitConfirm,
    reset,
    formState: { isDirty, isLoading: isFormLoading },
  } = useForm<ParticipationFormDataType>({
    mode: 'onBlur',
    values: participantsFormInitValues,
    resolver: effectSchemaResolver(ParticipationFormDataSchema),
  });

  const isDisabled = !isDirty || isFormLoading;

  const handleSetModal = useCallback(
    (value: boolean) => {
      setModalState(value);
      reset(participantsFormInitValues);
    },
    [setModalState, reset, participantsFormInitValues],
  );

  const handleSubmit: SubmitHandler<ParticipationFormDataType> = useCallback(
    async (values) => {
      setLoading(true);
      const response = await editParticipants(projectId, {
        ...values,
        members: memberOptions.filter((member) =>
          values.memberIds.includes(member.id),
        ),
      });
      setLoading(false);
      if (response.formErrors) {
        setServerActionErrors(response.formErrors, setError);
        return;
      }
      if (response.success) {
        openToast({
          variant: 'success',
          message: SUCCESS_MESSAGES.EDIT_PARTICIPANTS,
        });
        setModalState(false);
        reset(participantsFormInitValues);
        router.refresh();
        return;
      }
      if (response.error) {
        openToast({ variant: 'error', message: response.error });
        setModalState(false);
        return;
      }
    },
    [
      openToast,
      participantsFormInitValues,
      projectId,
      memberOptions,
      reset,
      router,
      setError,
      setModalState,
    ],
  );

  useEffect(() => {
    if (!isEmpty(participations)) {
      reset(participantsFormInitValues);
    }
  }, [participantsFormInitValues, participations, reset]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleSetModal}
      title="Edit Member(s)"
      customClass={{
        modalWrappper: 'max-w-screen-sm top-40',
      }}
    >
      <Controller
        name="memberIds"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => (
          <div className="flex flex-col gap-2">
            <label className="font-bold text-md">Members</label>
            <MultipleSelect
              onChange={(value) => {
                onChange(value);
              }}
              options={memberOptions.map((member) => ({
                name: member.name,
                value: member.id,
              }))}
              selectedOptions={value}
              onBlur={onBlur}
              disabled={isLoading}
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
        isLoading={isLoading}
        type="submit"
        customClass="w-full justify-center py-[19px] font-bold mb-8"
        onClick={submitConfirm(handleSubmit)}
        disabled={isDisabled}
      >
        Edit
      </Button>
    </BaseModal>
  );
};

export const EditParticipantModal = withToast(EditParticipantModalBase);
