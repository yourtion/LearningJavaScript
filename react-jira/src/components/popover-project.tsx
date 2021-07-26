import styled from '@emotion/styled';
import { Popover, Typography, List, Divider } from 'antd';
import { useProjectModal } from 'screens/project-list/util';
import { useProjects } from 'utils/project';
import { ButtonNoPadding } from './lib';

export const ProjectPopover = () => {
  const { data: projects, refetch } = useProjects();
  const { openProjectModal } = useProjectModal();
  const pinedProjects = projects?.filter((p) => p.pin);
  const content = (
    <ContentContainer>
      <Typography.Text type={'secondary'}>收藏项目</Typography.Text>
      <List>
        {pinedProjects?.map((project) => (
          <List.Item key={project.id}>
            <List.Item.Meta title={project.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
      <ButtonNoPadding type={'link'} onClick={() => openProjectModal()}>
        创建项目
      </ButtonNoPadding>
    </ContentContainer>
  );
  return (
    <Popover onVisibleChange={() => refetch()} placement={'bottom'} content={content}>
      <span>项目</span>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
