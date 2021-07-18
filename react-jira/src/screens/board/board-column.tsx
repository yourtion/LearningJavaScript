import { Board } from 'types';
import { useTasks } from 'utils/task';
import { useTasksSearchParams } from './util';

export const BoardColumn = ({ board }: { board: Board }) => {
  const { data: allTasks } = useTasks(useTasksSearchParams());
  const tasks = allTasks?.filter((task) => task.kanbanId === board.id);
  return (
    <div>
      <h3> {board.name}</h3>
      {tasks?.map((task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
};
