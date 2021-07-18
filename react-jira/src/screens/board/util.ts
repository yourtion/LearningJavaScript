import { useLocation } from 'react-router';
import { KEY_BOARDS } from 'utils/board';
import { useProject } from 'utils/project';
import { KEY_TASKS } from 'utils/task';

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

export const useTasksSearchParams = () => ({ projectId: useProjectIdInUrl() });
export const useTasksQueryKey = () => [KEY_TASKS, useTasksSearchParams()];
