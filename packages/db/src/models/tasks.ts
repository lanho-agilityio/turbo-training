// Constants
import {
  TASK_STATUS_VALUE,
  TASK_PRIORITY_VALUE,
} from "@repo/ui/constants/tasks";

// Models
import { BaseEntity } from "./base";

// Types
import { CustomStateType, ResponseStateType } from "@repo/ui/types/responses";

export type Task = BaseEntity & {
  dueDate: Date | string;
  status: TASK_STATUS_VALUE;
  priority: TASK_PRIORITY_VALUE;
  assignedTo: string;
  projectId: string;
};

export type TaskFormState = {
  formErrors?: {
    title?: string[];
    slug?: string[];
    status?: string[];
    description?: string[];
    dueDate?: string[];
    priority?: string[];
    assignedTo?: string[];
    projectId?: string[];
    image?: string[];
  };
} & CustomStateType &
  Partial<ResponseStateType<Task | null>>;

export type TaskStatisticResponse = {
  label: string;
  total: number;
};

export type TaskStatisticQueryParam = {
  field: string;
  value: string;
};
