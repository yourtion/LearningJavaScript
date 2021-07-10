import { Link } from 'react-router-dom';
import { Navigate, Route, Routes } from 'react-router';
import { BoardScreen } from 'screens/board';
import { EpicScreen } from 'screens/epic';

export const ProjectScreen = () => {
  return (
    <div>
      <h1>ProjectScreen</h1>
      <Link to={'board'}>看板</Link>
      <Link to={'epic'}>任务组</Link>
      <Routes>
        <Route path={'/board'} element={<BoardScreen />} />
        <Route path={'/epic'} element={<EpicScreen />} />
        <Navigate to={window.location.pathname + '/board'} />
      </Routes>
    </div>
  );
};
