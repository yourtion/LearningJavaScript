import { Form, Input, Select } from 'antd';
export interface User {
  id: number;
  name: string;
  token: string;
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
    <Form>
      <Form.Item>
        <Input type="text" value={param.name} onChange={(evt) => setParam({ ...param, name: evt.target.value })} />
        <Select value={param.personId} onChange={(val) => setParam({ ...param, personId: val })}>
          <Select.Option value={''}>负责人</Select.Option>
          {users.map((user) => (
            <Select.Option value={user.id} key={user.id}>
              {user.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};
