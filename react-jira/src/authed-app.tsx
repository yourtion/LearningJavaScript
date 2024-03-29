import styled from '@emotion/styled';
import { Button, Dropdown, Menu } from 'antd';
import { ButtonNoPadding, Row } from 'components/lib';
import { useAuth } from 'context/auth-context';
import { ProjectListScreen } from './screens/project-list';
import { ProjectScreen } from './screens/project';
import { ReactComponent as SoftwareLogo } from 'assets/software-logo.svg';
import { BrowserRouter as Router } from 'react-router-dom';
import { Navigate, Route, Routes } from 'react-router';
import { resetRoute } from 'utils';
import { ProjectModal } from 'screens/project-list/project-modal';
import { ProjectPopover } from 'components/popover-project';
import { UserPopover } from 'components/popover-user';

export default function AuthedApp() {
  return (
    <Container>
      <Router>
        <PageHeader />
        <Main>
          <Routes>
            <Route path={'/projects'} element={<ProjectListScreen />} />
            <Route path={'/projects/:projectId/*'} element={<ProjectScreen />} />
            <Navigate to={window.location.pathname + '/projects'} />
          </Routes>
        </Main>
        <ProjectModal />
      </Router>
    </Container>
  );
}

const PageHeader = () => {
  const { logout, user } = useAuth();
  const DropdownMenu = (
    <Menu>
      <Menu.Item key={'logout'}>
        <Button type={'link'} onClick={logout}>
          登出
        </Button>
      </Menu.Item>
    </Menu>
  );
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding style={{ padding: 0 }} type={'link'} onClick={resetRoute}>
          <SoftwareLogo width={'18rem'} color={'rgb(38, 132, 255)'} />
        </ButtonNoPadding>
        <ProjectPopover />
        <UserPopover />
      </HeaderLeft>
      <HeaderRight>
        <Dropdown overlay={DropdownMenu}>
          <Button type={'link'}>Hi, {user?.name}</Button>
        </Dropdown>
      </HeaderRight>
    </Header>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;

const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const HeaderLeft = styled(Row)``;

const HeaderRight = styled(Row)``;

const Main = styled.main`
  overflow: hidden;
  display: flex;
`;
