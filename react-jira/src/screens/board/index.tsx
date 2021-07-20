import styled from '@emotion/styled';
import { Spin } from 'antd';
import { Drag, Drop, DropChild } from 'components/drag-and-drop';
import { ScreenContainer } from 'components/lib';
import { useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useDocumentTitle } from 'utils';
import { useBoards, useReorderBoard } from 'utils/board';
import { useReorderTask, useTasks } from 'utils/task';
import { BoardColumn } from './board-column';
import { CreateBoard } from './create-board';
import { SearchPanel } from './search-panel';
import { TaskModal } from './task-modal';
import {
  useBoardQueryKey,
  useBoardSearchParams,
  useProjectInUrl,
  useTasksQueryKey,
  useTasksSearchParams,
} from './util';

export const BoardScreen = () => {
  useDocumentTitle('看板列表');
  const { data: boards, isLoading: boardIsLoading } = useBoards(useBoardSearchParams());
  const { data: currectProject } = useProjectInUrl();
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams());
  const isLoading = taskIsLoading || boardIsLoading;

  const onDragEnd = useDragEnd();

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ScreenContainer>
        <h1>{currectProject?.name}看板</h1>
        <SearchPanel />
        {isLoading ? (
          <Spin size={'large'} />
        ) : (
          <ColumnsContainer>
            <Drop type={'COLUMN'} direction={'horizontal'} droppableId={'board'}>
              <DropChild style={{ display: 'flex' }}>
                {boards?.map((board, index) => (
                  <Drag key={board.id} draggableId={'board-' + board.id} index={index}>
                    <BoardColumn board={board} key={board.id} />
                  </Drag>
                ))}
              </DropChild>
            </Drop>
            <CreateBoard />
          </ColumnsContainer>
        )}
        <TaskModal />
      </ScreenContainer>
    </DragDropContext>
  );
};

export function useDragEnd() {
  const { data: boards } = useBoards(useBoardSearchParams());
  const { data: allTasks = [] } = useTasks(useTasksSearchParams());
  const { mutate: reorderBoard } = useReorderBoard(useBoardQueryKey());
  const { mutate: reorderTask } = useReorderTask(useTasksQueryKey());
  return useCallback(
    ({ source, destination, type }: DropResult) => {
      if (!destination) return;
      // 看板排序
      if (type === 'COLUMN') {
        const fromId = boards?.[source.index].id;
        const toId = boards?.[destination.index].id;
        if (!fromId || !toId || fromId === toId) return;
        const type = destination.index > source.index ? 'after' : 'before';
        reorderBoard({ fromId, referenceId: toId, type });
      }
      // 任务排序
      if (type === 'ROW') {
        // 不允许跨看板拖拽
        const fromBoardId = +source.droppableId;
        const toBoardId = +destination.droppableId;
        const fromTask = allTasks.filter((t) => t.kanbanId === fromBoardId)[source.index];
        const toTask = allTasks.filter((t) => t.kanbanId === toBoardId)[destination.index];
        console.log({ fromBoardId, toBoardId, fromTask, toTask });
        if (fromTask?.id === toTask?.id) return;
        reorderTask({
          fromId: fromTask.id,
          referenceId: toTask?.id,
          type: fromBoardId === toBoardId && destination.index > source.index ? 'after' : 'before',
          fromKanbanId: fromBoardId,
          toKanbanId: toBoardId,
        });
      }
    },
    [boards, reorderBoard, allTasks, reorderTask]
  );
}

export const ColumnsContainer = styled.div`
  display: flex;
  overflow-x: scroll;
  flex: 1;
`;
