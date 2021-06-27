export interface User {
  id: number;
  name: string;
}

interface SearchPanelProp {
  users: User[];
  param: {
    name: string;
    personId: string;
  };
  setParam: (param: SearchPanelProp['param']) => void;
}

export const SearchPanel = ({ users, param, setParam }: SearchPanelProp) => {
  return (
    <form>
      <div>
        <input type="text" value={param.name} onChange={(evt) => setParam({ ...param, name: evt.target.value })} />
        <select value={param.personId} onChange={(evt) => setParam({ ...param, personId: evt.target.value })}>
          <option value={''}>负责人</option>
          {users.map((user) => (
            <option value={user.id} key={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
};
