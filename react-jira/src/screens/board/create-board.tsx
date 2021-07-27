import { Input } from 'antd';
import { useState } from 'react';
import { useAddBoard } from 'utils/board';
import { Container } from './board-column';
import { useBoardQueryKey, useProjectIdInUrl } from './util';

export const CreateBoard = () => {
  const [name, setName] = useState('');
  const projectId = useProjectIdInUrl();

  const { mutateAsync: addBoard } = useAddBoard(useBoardQueryKey());

  const submit = async () => {
    await addBoard({ name, projectId });
    setName('');
  };
  return (
    <Container>
      <Input
        size={'large'}
        placeholder={'新建看板名称'}
        onPressEnter={submit}
        value={name}
        onChange={(evt) => setName(evt.target.value)}
      />
    </Container>
  );
};
