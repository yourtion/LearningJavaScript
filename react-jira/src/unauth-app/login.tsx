import { useAuth } from 'context/auth-context';
import { Form, Input } from 'antd';
import { LongButton } from './';
import { useAsync } from 'utils/use-async';

export const LoginScreen = ({ onError }: { onError: (e: Error) => void }) => {
  const { login } = useAuth();
  const { isLoading: isLoaing, run } = useAsync(undefined, { throwOnError: true });
  const handleSubmit = (values: { username: string; password: string }) => {
    run(login(values)).catch(onError);
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item name={'username'} rules={[{ required: true, message: '请输入用户名' }]}>
        <Input placeholder={'用户名'} type="text" id={'username'} />
      </Form.Item>
      <Form.Item name={'password'} rules={[{ required: true, message: '请输入密码' }]}>
        <Input placeholder={'密码'} type="password" id={'password'} />
      </Form.Item>
      <Form.Item>
        <LongButton loading={isLoaing} htmlType={'submit'} type={'primary'}>
          登录
        </LongButton>
      </Form.Item>
    </Form>
  );
};
