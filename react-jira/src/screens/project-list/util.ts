import { useMemo } from 'react';
import { useProject } from 'utils/project';
import { useUrlQueryParam } from 'utils/url';

export function useProjectSearchParams() {
  const [param, setParam] = useUrlQueryParam(['name', 'personId']);
  return [useMemo(() => ({ ...param, personId: Number(param.personId) || undefined }), [param]), setParam] as const;
}

export function useProjectModal() {
  const [{ projcetCreate, editingProjectId }, setProjectModal] = useUrlQueryParam([
    'projcetCreate',
    'editingProjectId',
  ]);

  const { data: editingProject, isLoading } = useProject(Number(editingProjectId));

  const openProjectModal = () => setProjectModal({ projcetCreate: true, editingProjectId: undefined });
  const closeProjectModal = () => setProjectModal({ projcetCreate: undefined, editingProjectId: undefined });
  const startEdit = (id: number) => setProjectModal({ editingProjectId: id });

  return {
    projectModalOpen: projcetCreate === 'true' || Boolean(editingProjectId),
    openProjectModal,
    closeProjectModal,
    editingProject,
    startEdit,
    isLoading,
  };
}
