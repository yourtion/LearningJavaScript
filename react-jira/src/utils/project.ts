import { useCallback, useEffect } from 'react';
import { Project } from 'screens/project-list/list';
import { cleanObject } from 'utils';
import { useHttp } from './http';
import { useAsync } from './use-async';

export function useProjects(param?: Partial<Project>) {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();

  const fetchProject = useCallback(() => client('projects', { data: cleanObject(param || {}) }), [param, client]);
  useEffect(() => {
    run(fetchProject(), { retry: fetchProject });
  }, [param, fetchProject, run]);

  return result;
}

export function useEditProject() {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();
  const mutate = (params: Partial<Project>) => {
    const { id, ...restParams } = params;
    return run(client(`projects/${id}`, { data: restParams, method: 'PATCH' }));
  };

  return { mutate, ...result };
}

export function useAddProject() {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();
  const mutate = (params: Partial<Project>) => {
    run(client(`projects`, { data: params, method: 'POST' }));
  };
  return { mutate, ...result };
}
