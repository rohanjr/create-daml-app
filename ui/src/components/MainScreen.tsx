import React from 'react'
import { Image, Menu } from 'semantic-ui-react'
import Ledger from '@digitalasset/daml-ledger-fetch';
import MainController from './MainController';
import { useParty } from '../daml-react-hooks';

type Props = {
  onLogout: () => void;
}

/**
 * React component for the main screen of the `App`.
 */
const MainScreen: React.FC<Props> = ({onLogout}) => {
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
            You are logged in as {useParty()}.
          </Menu.Item>
          <Menu.Item
            position='right'
            active={false}
            onClick={onLogout}
            icon='log out'
          />
        </Menu.Menu>
      </Menu>

      <MainController/>
    </>
  );
};

export default MainScreen;
