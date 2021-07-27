import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router';
import { useDebounce } from 'utils';
import { KEY_BOARDS } from 'utils/board';
import { useProject } from 'utils/project';
import { KEY_TASKS, useTask } from 'utils/task';
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
  const debouncedName = useDebounce(param.name, 300);
  return useMemo(
    () => ({
      projectId,
      typeId: Number(param.typeId) || undefined,
      processorId: Number(param.processorId) || undefined,
      tagId: Number(param.tagId) || undefined,
      name: debouncedName,
    }),
    [projectId, param, debouncedName]
  );
};
export const useTasksQueryKey = () => [KEY_TASKS, useTasksSearchParams()];

export function useTasksModal() {
  const [{ editingTaskId }, setEditingTaskId] = useUrlQueryParam(['editingTaskId']);
  const { data: editingTask, isLoading } = useTask(Number(editingTaskId));
  const startEdit = useCallback(
    (id: number) => {
      setEditingTaskId({ editingTaskId: id });
    },
    [setEditingTaskId]
  );
  const closeEdit = useCallback(() => {
    setEditingTaskId({ editingTaskId: '' });
  }, [setEditingTaskId]);
  return { editingTaskId, editingTask, startEdit, closeEdit, isLoading };
}
