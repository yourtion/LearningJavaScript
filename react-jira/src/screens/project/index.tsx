import { Link } from 'react-router-dom';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { BoardScreen } from 'screens/board';
import { EpicScreen } from 'screens/epic';
import styled from '@emotion/styled';
import { Menu } from 'antd';

function useRouteType() {
  const units = useLocation().pathname.split('/');
  return units.pop();
}

export const ProjectScreen = () => {
  const routeType = useRouteType()!;
  return (
    <Container>
      <Aside>
        <Menu mode={'inline'} selectedKeys={[routeType]}>
          <Menu.Item key={'board'}>
            <Link to={'board'}>看板</Link>
          </Menu.Item>
          <Menu.Item key={'epic'}>
            <Link to={'epic'}>任务组</Link>
          </Menu.Item>
        </Menu>
      </Aside>
      <Main>
        <Routes>
          <Route path={'/board'} element={<BoardScreen />} />
          <Route path={'/epic'} element={<EpicScreen />} />
          <Navigate to={window.location.pathname + '/board'} replace={true} />
        </Routes>
      </Main>
    </Container>
  );
};

const Aside = styled.aside`
  background-color: rgb(244, 245, 248);
  display: flex;
`;

const Main = styled.main`
  display: flex;
  box-shadow: -5px 0 5px -5px raba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
  overflow: hidden;
`;
