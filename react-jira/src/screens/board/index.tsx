import styled from '@emotion/styled';
import { Spin } from 'antd';
import { ScreenContainer } from 'components/lib';
import { useDocumentTitle } from 'utils';
import { useBoards } from 'utils/board';
import { useTasks } from 'utils/task';
import { BoardColumn } from './board-column';
import { CreateBoard } from './create-board';
import { SearchPanel } from './search-panel';
import { useBoardSearchParams, useProjectInUrl, useTasksSearchParams } from './util';

export const BoardScreen = () => {
  useDocumentTitle('看板列表');
  const { data: boards, isLoading: boardIsLoading } = useBoards(useBoardSearchParams());
  const { data: currectProject } = useProjectInUrl();
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams());
  const isLoading = taskIsLoading || boardIsLoading;
  return (
    <ScreenContainer>
      <h1>{currectProject?.name}看板</h1>
      <SearchPanel />
      {isLoading ? (
        <Spin size={'large'} />
      ) : (
        <ColumnsContainer>
          {boards?.map((board) => (
            <BoardColumn board={board} key={board.id} />
          ))}
          <CreateBoard />
        </ColumnsContainer>
      )}
    </ScreenContainer>
  );
};

export const ColumnsContainer = styled.div`
  display: flex;
  overflow-x: scroll;
  flex: 1;
`;
