import { useAuth } from 'context/auth-context';
import { UnauthApp } from 'unauth-app';
import { AuthedApp } from './authed-app';
import './App.css';
import { ErrorBoundary } from 'components/error-boundary';
import { FullPageErrorFallback } from 'components/lib';
function App() {
  const { user } = useAuth();
  return (
    <div className="App">
      <ErrorBoundary fallbackRender={FullPageErrorFallback}>{user ? <AuthedApp /> : <UnauthApp />}</ErrorBoundary>
    </div>
  );
}

export default App;
