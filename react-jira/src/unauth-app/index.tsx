import { useState } from 'react';
import { RegisterScreen } from './register';
import { LoginScreen } from './login';

export function UnauthApp() {
  const [isRegister, setIsRegister] = useState(false);
  const switchRegister = () => setIsRegister(!isRegister);
  return (
    <div>
      {isRegister ? <RegisterScreen /> : <LoginScreen />}
      <button onClick={switchRegister}>切换到{isRegister ? '登录' : '注册'}</button>
    </div>
  );
}
