import React from 'react';
import { Container, Grid, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import PartyListEdit from './PartyListEdit';
import GoalListEdit from './GoalListEdit';
import UserList from './UserList';
import { User } from '../daml/User';
import { Goal } from '../daml/Goal';
import { Party, Text } from '../ledger/Types';

export type Props = {
  myUser: User;
  allUsers: User[];
  myGoals: Goal[];
  onAddFriend: (friend: Party) => Promise<boolean>;
  onRemoveFriend: (friend: Party) => Promise<void>;
  onAddGoal: (pledge: Text, witness: Party | null) => Promise<boolean>;
  onReloadMyUser: () => void;
  onReloadAllUsers: () => void;
  onReloadMyGoals: () => void;
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
                <Icon name='star' />
                <Header.Content>
                  Goals
                </Header.Content>
              </Header>
              <Divider />
              <GoalListEdit
                goals={props.myGoals.map((goal) => goal.pledge)}
                onAddGoal={props.onAddGoal}
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
