import React from 'react';
import LoginScreen from './LoginScreen';
import MainScreen from './MainScreen';
import Credentials from '../ledger/Credentials';

/**
 * React component for the entry point into the application.
 */
const App: React.FC = () => {
  const [credentials, setCredentials] = React.useState<Credentials | undefined>(undefined);

  if (credentials === undefined) {
    return (
      <LoginScreen
        onLogin={(credentials) => setCredentials(credentials)}
      />
    );
  } else {
    return (
      <MainScreen
        credentials={credentials}
        onLogout={() => setCredentials(undefined)}
      />
    );
  }
}

export default App;
