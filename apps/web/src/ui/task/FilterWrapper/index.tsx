'use client';

import { useCallback, useState, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// Components
import { Checkbox } from '@repo/ui/components/Checkbox';
import { Dropdown } from '@repo/ui/components/Dropdown';
import { MultipleSelect } from '@repo/ui/components/MultipleSelect';

// Constants
import { ORDER_TYPES, SEARCH_PARAMS } from '@repo/ui/constants/queryParams';
import {
  TASK_STATUS_VALUE,
  TASK_PRIORITY_VALUE,
} from '@repo/ui/constants/tasks';

// Models
import { Participation } from '@repo/db/models/participations';
import { Project } from '@repo/db/models/projects';

// Types
import type { SearchParams } from '@repo/ui/types/query-params';
import type { OptionType } from '@repo/ui/types/components';

// Utils
import { getQueryParams, getSearchParams } from '@repo/ui/utils/queryParams';

export const STATUS_OPTIONS: OptionType[] = [
  {
    name: 'Done',
    value: 'done',
  },
  {
    name: 'Not Started',
    value: 'not_started',
  },
  {
    name: 'In Progress',
    value: 'in_progress',
  },
];

export const PRIORITY_OPTIONS: OptionType[] = [
  {
    name: 'Low',
    value: 'low',
  },

  {
    name: 'High',
    value: 'high',
  },
  {
    name: 'Medium',
    value: 'medium',
  },
];

export const SORT_OPTIONS: OptionType[] = [
  {
    name: 'Desc',
    value: 'desc',
  },
  {
    name: 'Asc',
    value: 'asc',
  },
];

interface FilterWrapperProps {
  showPriorityFilter?: boolean;
  showStatusFilter?: boolean;
  showFilterCheckbox?: boolean;
  checkboxLabel?: string;
  projectList?: Project[];
  assignedToList?: Participation[];
}

export const FilterWrapper = ({
  showPriorityFilter = false,
  showStatusFilter = false,
  showFilterCheckbox = false,
  checkboxLabel = 'View All',
  projectList = [],
  assignedToList = [],
}: FilterWrapperProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const [, startTransition] = useTransition();

  const searchParamsObject: SearchParams & {
    status?: TASK_STATUS_VALUE;
    priority?: TASK_PRIORITY_VALUE;
    projectId?: string;
    userId?: string;
    filterByUser?: string;
  } = getSearchParams(searchParams);
  const priority =
    (searchParamsObject.priority &&
      decodeURIComponent(searchParamsObject.priority).split(',')) ||
    [];
  const status =
    (searchParamsObject.status &&
      decodeURIComponent(searchParamsObject.status).split(',')) ||
    [];
  const sortBy = searchParamsObject.sortBy || ORDER_TYPES.DESC;
  const projectId =
    (searchParamsObject.projectId &&
      decodeURIComponent(searchParamsObject.projectId).split(',')) ||
    [];
  const userId =
    (searchParamsObject.userId &&
      decodeURIComponent(searchParamsObject.userId).split(',')) ||
    [];

  const updateSearchParams = useCallback(
    (searchParamKey: string, value: string) => {
      const search = getQueryParams({
        ...searchParamsObject,
        [searchParamKey]: value,
        // set page to 1 when update params
        page: 1,
      });
      startTransition(() => {
        if (search) {
          router.push(search);
        } else {
          router.push(pathname);
        }
      });
    },
    [searchParamsObject, pathname, router],
  );

  const handleStatusOnChange = useCallback(
    (listStatus: string[]) => {
      updateSearchParams(
        SEARCH_PARAMS.STATUS,
        encodeURIComponent(listStatus.join(',')),
      );
    },
    [updateSearchParams],
  );

  const handlePriorityOnChange = useCallback(
    (listPriority: string[]) => {
      updateSearchParams(
        SEARCH_PARAMS.PRIORITY,
        encodeURIComponent(listPriority.join(',')),
      );
    },
    [updateSearchParams],
  );

  const handleProjectOnChange = useCallback(
    (listProject: string[]) => {
      updateSearchParams(
        SEARCH_PARAMS.PROJECT_ID,
        encodeURIComponent(listProject.join(',')),
      );
    },
    [updateSearchParams],
  );

  const handleUserOnChange = useCallback(
    (listUser: string[]) => {
      updateSearchParams(
        SEARCH_PARAMS.USER_ID,
        encodeURIComponent(listUser.join(',')),
      );
    },
    [updateSearchParams],
  );

  const handleSelectSort = useCallback(
    (sortBy: string) => {
      updateSearchParams(SEARCH_PARAMS.SORT_BY, sortBy);
    },
    [updateSearchParams],
  );

  const handleCheckboxOnChange = useCallback(
    (value: boolean) => {
      if (value) {
        setIsChecked(value);
      } else {
        setIsChecked(false);
      }
      updateSearchParams(SEARCH_PARAMS.FILTER_BY_USER, value ? 'true' : '');
    },
    [updateSearchParams],
  );

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-2.5">
        <div className="flex flex-col gap-2.5 md:flex-row">
          {projectList.length !== 0 && (
            <MultipleSelect
              title="Project"
              onChange={handleProjectOnChange}
              selectedOptions={projectId}
              options={projectList.map((project) => ({
                name: project.title,
                value: project.id,
              }))}
              customClass={{
                dropdown: 'w-fit',
              }}
            />
          )}
          {assignedToList.length !== 0 && (
            <MultipleSelect
              title="Assigned To"
              onChange={handleUserOnChange}
              selectedOptions={userId}
              options={assignedToList.map((user) => ({
                name: user.name,
                value: user.userId,
              }))}
              customClass={{
                dropdown: 'w-fit',
              }}
            />
          )}
          {showStatusFilter && (
            <MultipleSelect
              title="Status"
              selectedOptions={status}
              onChange={handleStatusOnChange}
              options={STATUS_OPTIONS}
            />
          )}
          {showPriorityFilter && (
            <MultipleSelect
              title="Priority"
              selectedOptions={priority}
              onChange={handlePriorityOnChange}
              options={PRIORITY_OPTIONS}
            />
          )}
        </div>
        <div className="flex flex-col gap-3.75 md:gap-2.5 md:flex-row">
          <Dropdown
            placeholder="Sort"
            customClass={{
              placeholder: 'text-black dark:text-white',
              button: 'py-3 px-5',
            }}
            options={SORT_OPTIONS}
            selectedItemValue={sortBy}
            onSelect={handleSelectSort}
          />
          {showFilterCheckbox && (
            <Checkbox
              className="w-7 h-7"
              label={checkboxLabel}
              checked={isChecked || searchParamsObject.filterByUser === 'true'}
              onChange={(e) => {
                handleCheckboxOnChange(e.target.checked);
              }}
              customClass={{
                label: 'text-md font-normal',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
