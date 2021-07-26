import { Button, List } from 'antd';
import { Row, ScreenContainer } from 'components/lib';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEpicQueryKey, useEpicSearchParams, useProjectInUrl } from 'screens/epic/util';
import { useDocumentTitle } from 'utils';
import { useDeleteEpic, useEpics } from 'utils/epic';
import { useTasks } from 'utils/task';
import { CreateEpic } from './create-epic';

export const EpicScreen = () => {
  useDocumentTitle('任务组列表');

  const { data: currentProject } = useProjectInUrl();
  const { data: epics } = useEpics(useEpicSearchParams());
  const { data: tasks } = useTasks({ projectId: currentProject?.id });
  const { mutate: deleteEpic } = useDeleteEpic(useEpicQueryKey());
  const [epicCreateOpen, setEpicCreateOpen] = useState(false);

  return (
    <ScreenContainer>
      <Row between={true}>
        <h1>{currentProject?.name}任务组</h1>
        <Button type={'link'} onClick={() => setEpicCreateOpen(true)}>
          创建任务组
        </Button>
      </Row>
      <List
        dataSource={epics}
        itemLayout={'vertical'}
        style={{ overflow: 'scroll' }}
        renderItem={(epic) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row between={true}>
                  <span>{epic.name}</span>
                  <Button onClick={() => deleteEpic({ id: epic.id })} type={'link'}>
                    删除
                  </Button>
                </Row>
              }
              description={
                <div>
                  <div>开始时间：{dayjs(epic.start).format('YYYY-MM-DD')}</div>
                  <div>结束时间：{dayjs(epic.end).format('YYYY-MM-DD')}</div>
                </div>
              }
            />
            <div>
              {tasks
                ?.filter((task) => task.epicId === epic.id)
                .map((task) => (
                  <Link to={`/projects/${currentProject?.id}/board?editingTaskId=${task.id}`} key={task.id}>
                    {task.name}
                  </Link>
                ))}
            </div>
          </List.Item>
        )}
      />
      <CreateEpic visible={epicCreateOpen} onClose={() => setEpicCreateOpen(false)} />
    </ScreenContainer>
  );
};
