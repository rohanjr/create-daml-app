import { storiesOf } from '@storybook/react';
import React from 'react';
import MainView, { Props } from "./MainView";
import { Party, Text } from '../ledger/Types';
import { User } from '../daml/User';

const addFriend = async (friend: Party): Promise<boolean> => { alert('Add friend: ' + friend); return true; }
const removeFriend = async (friend: Party) => { alert('Remove friend: ' + friend); }
const addGoal = async (pledge: Text): Promise<boolean> => { alert('Add goal: ' + pledge); return true; }
const reloadMyUser = () => { alert('Load my user'); }
const loadAllUsers = () => { alert('Load all users'); }
const loadGoals = () => {alert('Load my goals'); }

const makeProps = (user: User, allUsers: User[]): Props => ({
  myUser: user,
  allUsers,
  myGoals: [],
  myPendingGoals: [],
  onAddFriend: addFriend,
  onRemoveFriend: removeFriend,
  onAddGoal: addGoal,
  onReloadMyUser: reloadMyUser,
  onReloadAllUsers: loadAllUsers,
  onReloadMyGoals: loadGoals,
})

const alice: User = { party: 'Alice', friends: ['Bob', 'Charlie'], goals: []};
const bob: User = { party: 'Bob', friends: ['Dave'], goals: []};
const charlie: User = { party: 'Charlie', friends: [], goals: []};

storiesOf("MainView", module)
  .add("default", () => (
    <>{MainView(makeProps(alice, [alice, bob, charlie]))}</>
  ))
  .add("empty", () => (
    <>{MainView(makeProps(charlie, []))}</>
  ))
  ;
