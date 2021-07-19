import { Board } from 'types';
import { useTasks } from 'utils/task';
import { useTaskTypes } from 'utils/task-type';
import { useTasksSearchParams } from './util';
import taskIcon from 'assets/task.svg';
import bugIcon from 'assets/bug.svg';
import styled from '@emotion/styled';
import { Card } from 'antd';
import { CreateTask } from './create-task';

const TASK_ICON_MAP = {
  task: taskIcon,
  bug: bugIcon,
} as Record<string, string>;

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) return null;
  return <img src={TASK_ICON_MAP[name]} />;
};

export const BoardColumn = ({ board }: { board: Board }) => {
  const param = useTasksSearchParams();
  const { data: allTasks } = useTasks(param);
  const tasks = allTasks?.filter((task) => task.kanbanId === board.id);
  return (
    <Container>
      <h3> {board.name}</h3>
      <TaskContainer>
        {tasks?.map((task) => (
          <Card style={{ marginBottom: '0.5rem' }} key={task.id}>
            <div>{task.name} </div>
            <TaskTypeIcon id={task.typeId} />
          </Card>
        ))}
        <CreateTask boardId={board.id} />
      </TaskContainer>
    </Container>
  );
};

export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;

const TaskContainer = styled.div`
  overflow: scroll;
  flex: 1;
  ::-webkit-scrollbar {
    display: none;
  }
`;
