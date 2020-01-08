import React from 'react'
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react'
import Credentials, { preCheckCredentials, computeToken } from '../ledger/Credentials';
import Ledger from '../ledger/Ledger';
import LedgerError from '../ledger/Ledger';
import { User } from '../daml/User';
import { usePseudoLookupByKey } from '../daml-react-hooks';

type Props = {
  onLogin: (credentials: Credentials) => void;
}

enum Status { Normal, LoggingIn, SigningUp }

/**
 * React component for the login screen of the `App`.
 */
const LoginScreen: React.FC<Props> = ({onLogin}) => {
  const [status, setStatus] = React.useState(Status.Normal);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const withCredentials = async (cont: (credentials: Credentials) => Promise<void>) => {
    const credentials = {
      party: username,
      token: password,
    }
    const error = preCheckCredentials(credentials);
    if (error !== null) {
      alert(error);
      return;
    }
    await cont(credentials);
  }

  const handleLogin = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    await withCredentials(async (credentials) => {
      try {
        setStatus(Status.LoggingIn);
        const ledger = new Ledger(credentials.token);
        const user = await ledger.pseudoLookupByKey(User, {party: username});
        if (user) {
          setStatus(Status.Normal);
          onLogin(credentials);
        } else {
          alert("You have not yet signed up.");
        }
      } finally {
        setStatus(Status.Normal);
      }
    });
  }

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    await withCredentials(async (credentials) => {
      try {
        setStatus(Status.SigningUp)
        const ledger = new Ledger(credentials.token);
        const user: User = {party: username, friends: []};
        await ledger.create(User, user);
        await handleLogin();
      } finally {
        setStatus(Status.Normal);
      }
    });
  }

  const handleCalculatePassword = (event: React.FormEvent) => {
    event.preventDefault();
    const password = computeToken(username);
    setPassword(password);
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h1' textAlign='center' size='huge' style={{color: '#223668'}}>
          <Header.Content>
            Create
            <Image
              as='a'
              href='https://www.daml.com/'
              target='_blank'
              src='/daml.svg'
              alt='DAML Logo'
              spaced
              size='small'
              verticalAlign='middle'
            />
            App
          </Header.Content>
        </Header>
        <Form size='large'>
          <Segment>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='Username'
              value={username}
              onChange={e => setUsername(e.currentTarget.value)}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              action={{
                icon: 'calculator',
                onClick: handleCalculatePassword,
              }}
              value={password}
              onChange={e => setPassword(e.currentTarget.value)}
            />
            <Button.Group fluid size='large'>
              <Button
                primary
                loading={status === Status.LoggingIn}
                onClick={handleLogin}
              >
                Log in
              </Button>
              <Button
                secondary
                loading={status === Status.SigningUp}
                onClick={handleSignup}
              >
                Sign up
              </Button>
            </Button.Group>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default LoginScreen;
