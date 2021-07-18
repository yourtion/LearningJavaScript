import { QueryKey, useQueryClient } from 'react-query';

export function useConfig(queryKey: QueryKey, callback: (target: any, old: any[]) => any[]) {
  const queryClient = useQueryClient();
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    async onMutate(target: any) {
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old || []);
      });
      return { previousItems };
    },
    onError(error: any, newItem: any, context: any) {
      queryClient.setQueryData(queryKey, context.previousItems);
    },
  };
}

export const useDeleteConfig = (queyKey: QueryKey) =>
  useConfig(queyKey, (target, old) => {
    return old.filter((item) => item.id !== target.id);
  });

export const useEditConfig = (queyKey: QueryKey) =>
  useConfig(queyKey, (target, old) => {
    return old.map((item) => (item.id === target.id ? { ...item, ...target } : item));
  });

export const useAddConfig = (queyKey: QueryKey) =>
  useConfig(queyKey, (target, old) => {
    const newTarget = { ...target };
    if (!newTarget.id) {
      newTarget.id = Math.random();
    }
    return [...old, newTarget];
  });
