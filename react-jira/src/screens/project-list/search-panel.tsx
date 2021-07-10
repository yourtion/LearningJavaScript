/** @jsxImportSource @emotion/react */
import { Form, Input, Select } from 'antd';
export interface User {
  id: string;
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
    <Form css={{ marginBottom: '2rem' }} layout={'inline'}>
      <Form.Item>
        <Input
          type="text"
          placeholder={'项目名'}
          value={param.name}
          onChange={(evt) => setParam({ ...param, name: evt.target.value })}
        />
      </Form.Item>
      <Form.Item>
        <Select value={param.personId} onChange={(val) => setParam({ ...param, personId: val })}>
          <Select.Option value={''}>负责人</Select.Option>
          {users.map((user) => (
            // TODO: 处理 userId 类型问题
            <Select.Option value={String(user.id)} key={user.id}>
              {user.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};
