import { Button, Input } from 'antd';
import { Row } from 'components/lib';
import { TaskTypeSelect } from 'components/select-task-type';
import { UserSelect } from 'components/select-user';
import { useSetUrlSearchParam } from 'utils/url';
import { useTasksSearchParams } from './util';

export const SearchPanel = () => {
  const param = useTasksSearchParams();
  const setSearchParams = useSetUrlSearchParam<typeof param>();
  const reset = () => setSearchParams({ typeId: undefined, processorId: undefined, tagId: undefined, name: undefined });

  return (
    <Row marginBottom={4} gap={true}>
      <Input
        style={{ width: '20rem' }}
        placeholder={'任务名'}
        value={param.name}
        onChange={(evt) => setSearchParams({ name: evt.target.value })}
      />
      <UserSelect
        defaultOptionName={'经办人'}
        value={param.processorId}
        onChange={(value) => setSearchParams({ processorId: value })}
      />
      <TaskTypeSelect
        defaultOptionName={'类型'}
        value={param.typeId}
        onChange={(value) => setSearchParams({ typeId: value })}
      />
      <Button onClick={reset}>清除筛选器</Button>
    </Row>
  );
};
