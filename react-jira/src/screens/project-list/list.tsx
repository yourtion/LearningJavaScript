import { User, Project } from 'types';
import { Dropdown, Menu, Table, TableProps, Modal } from 'antd';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { Pin } from 'components/pin';
import { useDeleteProject, useEditProject } from 'utils/project';
import { ButtonNoPadding } from 'components/lib';
import { useProjectModal, useProjectQueryKey } from './util';
interface ListProps extends TableProps<Project> {
  users: User[];
}

export const List = ({ users, ...props }: ListProps) => {
  const { mutate } = useEditProject(useProjectQueryKey());
  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin });
  return (
    <Table
      pagination={false}
      rowKey={'id'}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            return <Pin checked={project.pin} onCheckedChange={pinProject(project.id)} />;
          },
        },
        {
          title: '名称',
          render(value, project) {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: '部门',
          dataIndex: 'organization',
        },
        {
          title: '负责人',
          render(value, project) {
            return <span>{users.find((user) => user.id === project.personId)?.name || '未知'}</span>;
          },
        },
        {
          title: '创建时间',
          render(value, project) {
            return <span>{project.created ? dayjs(project.created).format('YYYY-MM-DD') : '无'}</span>;
          },
        },
        {
          render(value, project) {
            return <More project={project} />;
          },
        },
      ]}
      {...props}
    />
  );
};

const More = ({ project }: { project: Project }) => {
  const { startEdit } = useProjectModal();
  const editProject = (id: number) => () => startEdit(id);
  const { mutate: deleteProject } = useDeleteProject(useProjectQueryKey());
  const confirmDeleteProject = (project: Project) => {
    Modal.confirm({
      title: `确定删除 ${project.name} 吗？`,
      content: '点击确定删除',
      okText: '确定',
      onOk() {
        deleteProject(project);
      },
    });
  };
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={'edit'}>
            <ButtonNoPadding type={'link'} onClick={editProject(project.id)}>
              编辑
            </ButtonNoPadding>
          </Menu.Item>
          <Menu.Item key={'delete'}>
            <ButtonNoPadding type={'link'} onClick={() => confirmDeleteProject(project)}>
              删除
            </ButtonNoPadding>
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type={'link'}>...</ButtonNoPadding>
    </Dropdown>
  );
};
