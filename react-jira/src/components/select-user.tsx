import React from 'react';
import { useUsers } from 'utils/user';
import { IdSelect } from './id-select';

export const UserSelect = (props: Omit<React.ComponentProps<typeof IdSelect>, 'options'>) => {
  const { data: users } = useUsers();
  return <IdSelect options={users || []} {...props} />;
};
