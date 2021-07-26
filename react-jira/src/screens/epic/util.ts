import { useLocation } from 'react-router';
import { KEY_EPICS } from 'utils/epic';
import { useProject } from 'utils/project';

export function useProjectIdInUrl() {
  const { pathname } = useLocation();
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(id);
}

export function useProjectInUrl() {
  return useProject(useProjectIdInUrl());
}

export const useEpicSearchParams = () => ({ projectId: useProjectIdInUrl() });
export const useEpicQueryKey = () => [KEY_EPICS, useEpicSearchParams()];
