import { Card, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useAddTask } from 'utils/task';
import { useProjectIdInUrl, useTasksQueryKey } from './util';

export const CreateTask = ({ boardId }: { boardId: number }) => {
  const [name, setName] = useState('');
  const projectId = useProjectIdInUrl();
  const [inputMode, setInputMode] = useState(false);

  const { mutateAsync: addTask } = useAddTask(useTasksQueryKey());
  const submit = async () => {
    await addTask({ name, projectId, kanbanId: boardId });
    setInputMode(false);
  };
  const toggle = () => setInputMode((mode) => !mode);

  useEffect(() => {
    if (!inputMode) {
      setName('');
    }
  }, [inputMode]);

  if (!inputMode) {
    return <div onClick={toggle}>+创建事务</div>;
  }

  return (
    <Card>
      <Input
        onBlur={toggle}
        placeholder={'需要做写啥？'}
        autoFocus={true}
        onPressEnter={submit}
        value={name}
        onChange={(evt) => setName(evt.target.value)}
      />
    </Card>
  );
};
