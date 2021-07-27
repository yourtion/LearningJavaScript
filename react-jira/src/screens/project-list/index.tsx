import { Button } from 'antd';
import { SearchPanel } from './search-panel';
import { List } from './list';
import { useDebounce, useDocumentTitle } from 'utils';
import { useProjects } from 'utils/project';
import { useUsers } from 'utils/user';
import { useProjectModal, useProjectSearchParams } from './util';
import { ErrorBox, Row, ScreenContainer } from 'components/lib';

export const ProjectListScreen = () => {
  const [param, setParam] = useProjectSearchParams();
  const { isLoading, error, data: list } = useProjects(useDebounce(param, 500));
  const { data: users } = useUsers();
  const { openProjectModal } = useProjectModal();

  useDocumentTitle('项目列表');

  return (
    <ScreenContainer>
      <Row between={true}>
        <h1>项目列表</h1>
        <Button onClick={() => openProjectModal()}>创建项目</Button>
      </Row>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      <ErrorBox error={error} />
      <List loading={isLoading} users={users || []} dataSource={list || []} />
    </ScreenContainer>
  );
};

// 打开 WhyDidYouRender 追踪页面渲染原因
ProjectListScreen.whyDidYouRender = false;
