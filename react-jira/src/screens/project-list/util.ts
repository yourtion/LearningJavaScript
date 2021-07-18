import { useMemo } from 'react';
import { useUrlQueryParam } from 'utils/url';

export function useProjectSearchParams() {
  const [param, setParam] = useUrlQueryParam(['name', 'personId']);
  return [useMemo(() => ({ ...param, personId: Number(param.personId) || undefined }), [param]), setParam] as const;
}

export function useProjectModal() {
  const [{ projcetCreate }, setProjectCreate] = useUrlQueryParam(['projcetCreate']);

  const openProjectModal = () => setProjectCreate({ projcetCreate: true });
  const closeProjectModal = () => setProjectCreate({ projcetCreate: false });

  return {
    projectModalOpen: projcetCreate === 'true',
    openProjectModal,
    closeProjectModal,
  };
}
