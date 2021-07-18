import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Project } from 'screens/project-list/list';
import { cleanObject } from 'utils';
import { useHttp } from './http';

export const KEY_PROJECTS = 'projects';

export function useProjects(param?: Partial<Project>) {
  const client = useHttp();
  const data = cleanObject(param);
  return useQuery<Project[]>([KEY_PROJECTS, data], () => client('projects', { data }));
}

export function useEditProject() {
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: 'PATCH',
        data: params,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(KEY_PROJECTS),
    }
  );
}

export function useAddProject() {
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        method: 'POST',
        data: params,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(KEY_PROJECTS),
    }
  );
}

export function useProject(id?: number) {
  const client = useHttp();
  return useQuery<Project>(['project', { id }], () => client(`projects/${id}`), {
    enabled: !!id,
  });
}
