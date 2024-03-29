import { useAuth } from 'context/auth-context';
import { Form, Input } from 'antd';
import { LongButton } from './';
import { useAsync } from 'utils/use-async';

export const RegisterScreen = ({ onError }: { onError: (e: Error) => void }) => {
  const { register } = useAuth();
  const { isLoading, run } = useAsync(undefined, { throwOnError: true });
  const handleSubmit = ({ cpassword, ...values }: { username: string; password: string; cpassword: string }) => {
    if (cpassword !== values.password) {
      return onError(new Error('请确认两次输入的密码相同'));
    }
    run(register(values)).catch(onError);
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item name={'username'} rules={[{ required: true, message: '请输入用户名' }]}>
        <Input placeholder={'用户名'} type="text" id={'username'} />
      </Form.Item>
      <Form.Item name={'password'} rules={[{ required: true, message: '请输入密码' }]}>
        <Input placeholder={'密码'} type="password" id={'password'} />
      </Form.Item>
      <Form.Item name={'cpassword'} rules={[{ required: true, message: '请输入确认密码' }]}>
        <Input placeholder={'确认密码'} type="password" id={'cpassword'} />
      </Form.Item>
      <Form.Item>
        <LongButton loading={isLoading} htmlType={'submit'} type={'primary'}>
          注册
        </LongButton>
      </Form.Item>
    </Form>
  );
};
