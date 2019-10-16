import React from 'react'
import { Image, Menu } from 'semantic-ui-react'
import Credentials from '../ledger/Credentials';
import MainController from './MainController';

type Props = {
  credentials: Credentials;
  onLogout: () => void;
}

/**
 * React component for the main screen of the `App`.
 */
const MainScreen: React.FC<Props> = ({credentials, onLogout}) => {
  return (
    <>
      <Menu icon borderless>
        <Menu.Item>
          <Image
            as='a'
            href='https://www.daml.com/'
            target='_blank'
            src='/daml.svg'
            alt='DAML Logo'
            size='mini'
          />
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item position='right'>
            You are logged in as {credentials.username}.
          </Menu.Item>
          <Menu.Item
            position='right'
            active={false}
            onClick={onLogout}
            icon='log out'
          />
        </Menu.Menu>
      </Menu>

      <MainController credentials={credentials}/>
    </>
  );
};

export default MainScreen;
