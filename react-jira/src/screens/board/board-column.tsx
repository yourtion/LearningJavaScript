import React from 'react';
import { Board, Task } from 'types';
import { useTasks } from 'utils/task';
import { useTaskTypes } from 'utils/task-type';
import { useBoardQueryKey, useTasksModal, useTasksSearchParams } from './util';
import taskIcon from 'assets/task.svg';
import bugIcon from 'assets/bug.svg';
import styled from '@emotion/styled';
import { Button, Card, Dropdown, Menu, Modal } from 'antd';
import { CreateTask } from './create-task';
import { Mark } from 'components/mark';
import { useDeleteBoard } from 'utils/board';
import { Row } from 'components/lib';
import { Drag, Drop, DropChild } from 'components/drag-and-drop';

const TASK_ICON_MAP = {
  task: taskIcon,
  bug: bugIcon,
} as Record<string, string>;

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) return null;
  return <img src={TASK_ICON_MAP[name]} alt={name} />;
};

const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTasksModal();
  const { name: keyword } = useTasksSearchParams();

  return (
    <Card onClick={() => startEdit(task.id)} style={{ marginBottom: '0.5rem', cursor: 'pointer' }} key={task.id}>
      <p>
        <Mark name={task.name} keyword={keyword} />
      </p>
      <TaskTypeIcon id={task.typeId} />
    </Card>
  );
};

export const BoardColumn = React.forwardRef<HTMLDivElement, { board: Board }>(({ board, ...props }, ref) => {
  const { data: allTasks } = useTasks(useTasksSearchParams());
  const tasks = allTasks?.filter((task) => task.kanbanId === board.id);

  return (
    <Container {...props} ref={ref}>
      <Row between={true}>
        <h3> {board.name}</h3>
        <More board={board} key={board.id} />
      </Row>
      <TaskContainer>
        <Drop type={'ROW'} direction={'vertical'} droppableId={String(board.id)}>
          <DropChild style={{ minHeight: '5px' }}>
            {tasks?.map((task, index) => (
              <Drag key={task.id} index={index} draggableId={'task-' + task.id}>
                <div>
                  <TaskCard task={task} key={task.id} />
                </div>
              </Drag>
            ))}
          </DropChild>
        </Drop>
        <CreateTask boardId={board.id} />
      </TaskContainer>
    </Container>
  );
});

const More = ({ board }: { board: Board }) => {
  const { mutateAsync } = useDeleteBoard(useBoardQueryKey());
  const startEdit = () => {
    Modal.confirm({
      okText: '确定',
      cancelText: '取消',
      title: `确定删除${board.name}么？`,
      onOk() {
        return mutateAsync({ id: board.id });
      },
    });
  };
  const overlay = (
    <Menu>
      <Button type={'link'} onClick={startEdit}>
        删除
      </Button>
    </Menu>
  );
  return (
    <Dropdown overlay={overlay}>
      <Button type={'link'}>...</Button>
    </Dropdown>
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
