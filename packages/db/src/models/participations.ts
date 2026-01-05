// Types
import { CustomStateType, ResponseStateType } from "@repo/ui/types/responses";

export type Participation = {
  userId: string;
  projectId: string;
  createdAt: string;
  name: string;
  avatar?: string;
};

export type ParticipationFormState = {
  formErrors?: {
    memberIds?: string[];
  };
} & CustomStateType &
  Partial<ResponseStateType<null>>;
