export enum TASK_STATUS_VALUE {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export enum TASK_PRIORITY_VALUE {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export const TASK_STATUS_OPTIONS = [
  {
    name: 'Not Started',
    value: TASK_STATUS_VALUE.NOT_STARTED,
  },
  {
    name: 'In Progress',
    value: TASK_STATUS_VALUE.IN_PROGRESS,
  },
  {
    name: 'Done',
    value: TASK_STATUS_VALUE.DONE,
  },
];

export const TASK_PRIORITY_OPTIONS = [
  {
    name: 'Low',
    value: TASK_PRIORITY_VALUE.LOW,
  },
  {
    name: 'Medium',
    value: TASK_PRIORITY_VALUE.MEDIUM,
  },
  {
    name: 'High',
    value: TASK_PRIORITY_VALUE.HIGH,
  },
];

export const TASK_SECTION_VARIANT_MAPPING = {
  [TASK_STATUS_VALUE.NOT_STARTED]: 'error',
  [TASK_STATUS_VALUE.IN_PROGRESS]: 'warning',
  [TASK_STATUS_VALUE.DONE]: 'success',
};
