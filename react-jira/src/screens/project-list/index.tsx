import { Button, Typography } from 'antd';
import { SearchPanel } from './search-panel';
import { List } from './list';
import { useDebounce, useDocumentTitle } from 'utils';
import styled from '@emotion/styled';
import { useProjects } from 'utils/project';
import { useUsers } from 'utils/user';
import { useProjectSearchParams } from './util';
import { Row } from 'components/lib';

export const ProjectListScreen = (props: { setProjectModalOpen: (isOpen: boolean) => void }) => {
  const [param, setParam] = useProjectSearchParams();
  const { isLoaing, error, data: list, retry } = useProjects(useDebounce(param, 500));
  const { data: users } = useUsers();

  useDocumentTitle('项目列表');

  return (
    <Container>
      <Row between={true}>
        <h1>项目列表</h1>
        <Button onClick={() => props.setProjectModalOpen(true)}>创建项目</Button>
      </Row>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {error ? <Typography.Text type={'danger'}>{error.message}</Typography.Text> : null}
      <List
        loading={isLoaing}
        refresh={retry}
        setProjectModalOpen={props.setProjectModalOpen}
        users={users || []}
        dataSource={list || []}
      />
    </Container>
  );
};

// 打开 WhyDidYouRender 追踪页面渲染原因
ProjectListScreen.whyDidYouRender = false;

const Container = styled.div`
  padding: 3.2rem;
`;
