/** @jsxImportSource @emotion/react */
import { Form, Input, Select } from 'antd';
import { UserSelect } from 'components/user-select';
import { Project } from './list';
export interface User {
  id: number;
  name: string;
  token: string;
}

interface SearchPanelProp {
  users: User[];
  param: Partial<Pick<Project, 'name' | 'personId'>>;
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
        <UserSelect
          defaultOptionName={'负责人'}
          value={param.personId}
          onChange={(val) => setParam({ ...param, personId: val })}
        />
      </Form.Item>
    </Form>
  );
};
