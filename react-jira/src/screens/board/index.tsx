import styled from '@emotion/styled';
import { useDocumentTitle } from 'utils';
import { useBoards } from 'utils/board';
import { BoardColumn } from './board-column';
import { SearchPanel } from './search-panel';
import { useBoardSearchParams, useProjectInUrl } from './util';

export const BoardScreen = () => {
  useDocumentTitle('看板列表');
  const { data: boards } = useBoards(useBoardSearchParams());
  const { data: currectProject } = useProjectInUrl();
  return (
    <div>
      <h1>{currectProject?.name}看板</h1>
      <SearchPanel />
      <ColumnsContainer>
        {boards?.map((board) => (
          <BoardColumn board={board} key={board.id} />
        ))}
      </ColumnsContainer>
    </div>
  );
};

const ColumnsContainer = styled.div`
  display: flex;
  overflow: hidden;
  margin-right: 2rem;
`;
