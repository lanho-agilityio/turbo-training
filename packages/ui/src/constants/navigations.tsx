// Types
import type { Navigation } from "@repo/ui/types/navigations";

// Routes
import { ROUTES } from "./routes";

// Icons
import { BoardIcon } from "@repo/ui/icons/BoardIcon";
import { ProjectIcon } from "@repo/ui/icons/ProjectIcon";
import { TaskIcon } from "@repo/ui/icons/TaskIcon";
import { UserIcon } from "@repo/ui/icons/UserIcon";

export const NAVIGATION_LABELS = {
  SIGN_IN: "Sign In",
  SIGN_UP: "Sign Up",
  BOARDS: "Boards",
  PROJECTS: "Projects",
  TASKS: "Tasks",
};

export const NAVIGATION_ICONS = {
  BOARDS: <BoardIcon customClass="w-4 h-4" />,
  PROJECTS: <ProjectIcon customClass="w-4 h-4" />,
  TASKS: <TaskIcon customClass="w-4 h-4" />,
  SIGN_IN: <UserIcon customClass="w-4 h-4" />,
};

export const ADMIN_NAVIGATION_LIST: Navigation[] = [
  {
    href: ROUTES.ADMIN_BOARDS,
    label: NAVIGATION_LABELS.BOARDS,
    icon: NAVIGATION_ICONS.BOARDS,
  },
  {
    href: ROUTES.ADMIN_PROJECT_LIST,
    label: NAVIGATION_LABELS.PROJECTS,
    icon: NAVIGATION_ICONS.PROJECTS,
  },
  {
    href: ROUTES.ADMIN_TASK_LIST,
    label: NAVIGATION_LABELS.TASKS,
    icon: NAVIGATION_ICONS.TASKS,
  },
];

export const PUBLIC_NAVIGATION_LIST: Navigation[] = [
  {
    href: ROUTES.BOARDS,
    label: NAVIGATION_LABELS.BOARDS,
    icon: NAVIGATION_ICONS.BOARDS,
  },
  {
    href: ROUTES.PROJECT_LIST,
    label: NAVIGATION_LABELS.PROJECTS,
    icon: NAVIGATION_ICONS.PROJECTS,
  },
  {
    href: ROUTES.TASK_LIST,
    label: NAVIGATION_LABELS.TASKS,
    icon: NAVIGATION_ICONS.TASKS,
  },
  {
    href: ROUTES.SIGN_IN,
    label: NAVIGATION_LABELS.SIGN_IN,
    icon: NAVIGATION_ICONS.SIGN_IN,
  },
];
