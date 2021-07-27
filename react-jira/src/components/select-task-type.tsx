import React from 'react';
import { useTaskTypes } from 'utils/task-type';
import { IdSelect } from './id-select';

export const TaskTypeSelect = (props: Omit<React.ComponentProps<typeof IdSelect>, 'options'>) => {
  const { data: taskTypes } = useTaskTypes();
  return <IdSelect options={taskTypes || []} {...props} />;
};
