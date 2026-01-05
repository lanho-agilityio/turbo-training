// Utils
import { getQueryParams } from "@repo/ui/utils/queryParams";

export const ROUTES = {
  // Authentication
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGET_PASSWORD: "/forget-password",

  // Admin
  ADMIN_BOARDS: "/admin/boards",
  ADMIN_PROJECT_LIST: "/admin/projects",
  ADMIN_PROJECT_DETAIL: (id?: string) => `/admin/projects/${id}`,
  ADMIN_PROJECT_UPSERT: (id?: string) =>
    `/admin/projects/upsert${getQueryParams({ id })}`,
  ADMIN_TASK_LIST: "/admin/tasks",
  ADMIN_TASK_DETAIL: (id?: string) => `/admin/tasks/${id}`,
  ADMIN_TASK_CREATE: (params?: { projectId?: string; status?: string }) =>
    `/admin/tasks/create${getQueryParams({ ...params })}`,

  // Public Pages
  BOARDS: "/boards",
  PROJECT_LIST: "/projects",
  PROJECT_DETAIL: (slug?: string) => `/projects/${slug}`,
  TASK_LIST: "/tasks",
  TASK_DETAIL: (slug?: string) => `/tasks/${slug}`,
};
