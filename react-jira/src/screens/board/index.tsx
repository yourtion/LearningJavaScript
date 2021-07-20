import styled from '@emotion/styled';
import { Spin } from 'antd';
import { Drag, Drop, DropChild } from 'components/drag-and-drop';
import { ScreenContainer } from 'components/lib';
import { DragDropContext } from 'react-beautiful-dnd';
import { useDocumentTitle } from 'utils';
import { useBoards } from 'utils/board';
import { useTasks } from 'utils/task';
import { BoardColumn } from './board-column';
import { CreateBoard } from './create-board';
import { SearchPanel } from './search-panel';
import { TaskModal } from './task-modal';
import { useBoardSearchParams, useProjectInUrl, useTasksSearchParams } from './util';

export const BoardScreen = () => {
  useDocumentTitle('看板列表');
  const { data: boards, isLoading: boardIsLoading } = useBoards(useBoardSearchParams());
  const { data: currectProject } = useProjectInUrl();
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams());
  const isLoading = taskIsLoading || boardIsLoading;
  return (
    <DragDropContext onDragEnd={() => {}}>
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
                <CreateBoard />
              </DropChild>
            </Drop>
          </ColumnsContainer>
        )}
        <TaskModal />
      </ScreenContainer>
    </DragDropContext>
  );
};

export const ColumnsContainer = styled.div`
  display: flex;
  overflow-x: scroll;
  flex: 1;
`;
