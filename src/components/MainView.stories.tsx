import { storiesOf } from '@storybook/react';
import React from 'react';
import MainView, { Props } from "./MainView";
import { Party } from '../ledger/Types';
import { User } from '../daml/User';

const addFriend = async (friend: Party): Promise<boolean> => { alert('Add friend: ' + friend); return true; }
const removeFriend = async (friend: Party) => { alert('Remove friend: ' + friend); }
const writePost = async (content: string, sharingWith: string) => { alert('Writing post: "' + content + '" to friends ' + sharingWith); return true; }
const reloadMyUser = () => { alert('Load my user'); }
const loadAllUsers = () => { alert('Load all users'); }

const makeProps = (user: User, allUsers: User[]): Props => ({
  myUser: user,
  allUsers,
  onAddFriend: addFriend,
  onRemoveFriend: removeFriend,
  onPost: writePost,
  onReloadMyUser: reloadMyUser,
  onReloadAllUsers: loadAllUsers,
})

const alice: User = { party: 'Alice', friends: ['Bob', 'Charlie']};
const bob: User = { party: 'Bob', friends: ['Dave']};
const charlie: User = { party: 'Charlie', friends: []}

storiesOf("MainView", module)
  .add("default", () => (
    <>{MainView(makeProps(alice, [alice, bob, charlie]))}</>
  ))
  .add("empty", () => (
    <>{MainView(makeProps(charlie, []))}</>
  ))
  ;
