import { useState } from 'react';
import { Typography } from 'antd';
import { SearchPanel } from './search-panel';
import { List } from './list';
import { useDebounce, useDocumentTitle } from 'utils';
import styled from '@emotion/styled';
import { useProjects } from 'utils/project';
import { useUsers } from 'utils/user';
import { useUrlQueryParam } from 'utils/url';

export const ProjectListScreen = () => {
  const [param, setParam] = useUrlQueryParam(['name', 'personId']);
  const debouncedParam = useDebounce(param, 500);
  const { isLoaing, error, data: list } = useProjects(debouncedParam);
  const { data: users } = useUsers();

  useDocumentTitle('项目列表');

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {error ? <Typography.Text type={'danger'}>{error.message}</Typography.Text> : null}
      <List loading={isLoaing} users={users || []} dataSource={list || []} />
    </Container>
  );
};

// 打开 WhyDidYouRender 追踪页面渲染原因
ProjectListScreen.whyDidYouRender = false;

const Container = styled.div`
  padding: 3.2rem;
`;
