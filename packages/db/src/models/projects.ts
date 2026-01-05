// Models
import { BaseEntity } from "./base";

// Types
import { CustomStateType, ResponseStateType } from "@repo/ui/types/responses";

export type Project = BaseEntity & {
  isPublic: boolean;
};

export type ProjectFormState = {
  formErrors?: {
    title?: string[];
    description?: string[];
    isPublic?: string[];
    memberIds?: string[];
    image?: string[];
  };
} & CustomStateType &
  Partial<ResponseStateType<Project | null>>;
