import { useAuth } from 'context/auth-context';
import { UnauthApp } from 'unauth-app';
import { AuthedApp } from './authed-app';
import './App.css';
function App() {
  const { user } = useAuth();
  return <div className="App">{user ? <AuthedApp /> : <UnauthApp />}</div>;
}

export default App;
