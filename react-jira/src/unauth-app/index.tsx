import { useState } from 'react';
import { RegisterScreen } from './register';
import { LoginScreen } from './login';
import { Card, Button } from 'antd';

export function UnauthApp() {
  const [isRegister, setIsRegister] = useState(false);
  const switchRegister = () => setIsRegister(!isRegister);
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Card>
        {isRegister ? <RegisterScreen /> : <LoginScreen />}
        <Button onClick={switchRegister}>切换到{isRegister ? '登录' : '注册'}</Button>
      </Card>
    </div>
  );
}
