import React from 'react';
import { useAuth } from 'context/auth-context';
import './App.css';
import { ErrorBoundary } from 'components/error-boundary';
import { FullPageErrorFallback, FullPageLoading } from 'components/lib';

const AuthedApp = React.lazy(() => import('authed-app'));
const UnauthApp = React.lazy(() => import('unauth-app'));

function App() {
  const { user } = useAuth();
  return (
    <div className="App">
      <ErrorBoundary fallbackRender={FullPageErrorFallback}>
        <React.Suspense fallback={FullPageLoading}>{user ? <AuthedApp /> : <UnauthApp />}</React.Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
