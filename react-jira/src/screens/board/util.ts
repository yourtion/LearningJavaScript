import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { cleanObject } from 'utils';
import { KEY_BOARDS } from 'utils/board';
import { useProject } from 'utils/project';
import { KEY_TASKS } from 'utils/task';
import { useUrlQueryParam } from 'utils/url';

export function useProjectIdInUrl() {
  const { pathname } = useLocation();
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(id);
}

export function useProjectInUrl() {
  return useProject(useProjectIdInUrl());
}

export const useBoardSearchParams = () => ({ projectId: useProjectIdInUrl() });
export const useBoardQueryKey = () => [KEY_BOARDS, useBoardSearchParams()];

export const useTasksSearchParams = () => {
  const projectId = useProjectIdInUrl();
  const [param] = useUrlQueryParam(['name', 'typeId', 'processorId', 'tagId']);
  return useMemo(
    () => ({
      projectId,
      typeId: Number(param.typeId) || undefined,
      processorId: Number(param.processorId) || undefined,
      tagId: Number(param.tagId) || undefined,
      name: param.name,
    }),
    [projectId, param]
  );
};
export const useTasksQueryKey = () => [KEY_TASKS, useTasksSearchParams()];
