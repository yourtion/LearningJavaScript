import { QueryKey, useMutation, useQuery } from 'react-query';
import { Project } from 'screens/project-list/list';
import { cleanObject } from 'utils';
import { useHttp } from './http';
import { useAddConfig, useDeleteConfig, useEditConfig } from './use-optimistic-options';

export const KEY_PROJECTS = 'projects';

export function useProjects(param?: Partial<Project>) {
  const client = useHttp();
  const data = cleanObject(param);
  return useQuery<Project[]>([KEY_PROJECTS, data], () => client('projects', { data }));
}

export function useEditProject(queryKey: QueryKey) {
  const client = useHttp();

  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: 'PATCH',
        data: params,
      }),
    useEditConfig(queryKey)
  );
}

export function useAddProject(queryKey: QueryKey) {
  const client = useHttp();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        method: 'POST',
        data: params,
      }),
    useAddConfig(queryKey)
  );
}

export function useDeleteProject(queryKey: QueryKey) {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`projects/${id}`, {
        method: 'DELETE',
      }),
    useDeleteConfig(queryKey)
  );
}

export function useProject(id?: number) {
  const client = useHttp();
  return useQuery<Project>(['project', { id }], () => client(`projects/${id}`), {
    enabled: !!id,
  });
}
