import { useMemo } from 'react';
import { cleanObject } from 'utils';
import { KEY_PROJECTS, useProject } from 'utils/project';
import { useSetUrlSearchParam, useUrlQueryParam } from 'utils/url';

export function useProjectSearchParams() {
  const [param, setParam] = useUrlQueryParam(['name', 'personId']);
  return [
    useMemo(() => cleanObject({ ...param, personId: Number(param.personId) || undefined }), [param]),
    setParam,
  ] as const;
}

export function useProjectQueryKey() {
  return [KEY_PROJECTS, useProjectSearchParams()[0]];
}

export function useProjectModal() {
  const [{ projcetCreate, editingProjectId }] = useUrlQueryParam(['projcetCreate', 'editingProjectId']);

  const setSearchParams = useSetUrlSearchParam();

  const { data: editingProject, isLoading } = useProject(Number(editingProjectId));

  const openProjectModal = () => setSearchParams({ projcetCreate: true, editingProjectId: undefined });
  const closeProjectModal = () => setSearchParams({ projcetCreate: undefined, editingProjectId: undefined });
  const startEdit = (id: number) => setSearchParams({ editingProjectId: id });

  return {
    projectModalOpen: projcetCreate === 'true' || Boolean(editingProjectId),
    openProjectModal,
    closeProjectModal,
    editingProject,
    startEdit,
    isLoading,
  };
}
