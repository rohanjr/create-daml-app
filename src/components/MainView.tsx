import React from 'react';
import { Container, Grid, Header, Icon, Segment, Divider, Form, Input } from 'semantic-ui-react';
import PartyListEdit from './PartyListEdit';
import UserList from './UserList';
import { User } from '../daml/User';
import { Party } from '../ledger/Types';
import PostEdit from './PostEdit';

export type Props = {
  myUser: User;
  allUsers: User[];
  onAddFriend: (friend: Party) => Promise<boolean>;
  onRemoveFriend: (friend: Party) => Promise<void>;
  onReloadMyUser: () => void;
  onReloadAllUsers: () => void;
}

/**
 * React component for the view of the `MainScreen`.
 */
const MainView: React.FC<Props> = (props) => {
  return (
    <Container>
      <Grid centered columns={2}>
        <Grid.Row stretched>
          <Grid.Column>
            <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
                Welcome, {props.myUser.party}!
            </Header>

            <Segment>
              <Header as='h2'>
                <Icon name='pencil square' />
                <Header.Content>
                  <Header.Subheader>Share a post with some friends!</Header.Subheader>
                </Header.Content>
              </Header>
              <PostEdit
                writePost={async (content: string, sharingWith: string) => { return true; }}
              />
            </Segment>

            <Segment>
              <Header as='h2'>
                <Icon name='user' />
                <Header.Content>
                  {props.myUser.party}
                  <Header.Subheader>Me and my friends</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <PartyListEdit
                parties={props.myUser.friends}
                onAddParty={props.onAddFriend}
                onRemoveParty={props.onRemoveFriend}
              />
            </Segment>
            <Segment>
              <Header as='h2'>
                <Icon name='globe' />
                <Header.Content>
                  The Network
                  <Icon
                    link
                    name='sync alternate'
                    size='small'
                    style={{marginLeft: '0.5em'}}
                    onClick={props.onReloadAllUsers}
                  />
                  <Header.Subheader>Others and their friends</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <UserList
                users={props.allUsers}
                action={{
                  icon: 'add user',
                  onClick: props.onAddFriend
                }}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default MainView;
