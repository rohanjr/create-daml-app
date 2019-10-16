import React, { useEffect } from 'react';
import MainView from './MainView';
import Ledger from '../ledger/Ledger';
import { Party } from '../ledger/Types';
import { User } from '../daml/User';

const useAsyncEffect = (fn: () => Promise<void>, obs: unknown[]) => {
  const fn_ = () => { fn(); };
  useEffect(fn_, obs);
}

type Props = {
  ledger: Ledger;
}

/**
 * React component to control the `MainView`.
 */
const MainController: React.FC<Props> = ({ledger}) => {
  const [myUser, setMyUser] = React.useState<User>({party: '', friends: []});
  const [allUsers, setAllUsers] = React.useState<User[]>([]);

  const addFriend = async (friend: Party): Promise<boolean> => {
    try {
      await ledger.pseudoExerciseByKey(User.AddFriend, {party: ledger.party()}, {friend});
      await Promise.all([loadMyUser(), loadAllUsers()]);
      return true;
    } catch (error) {
      alert("Unknown error:\n" + JSON.stringify(error));
      return false;
    }
  }

  const removeFriend = async (friend: Party): Promise<void> => {
    try {
      await ledger.pseudoExerciseByKey(User.RemoveFriend, {party: ledger.party()}, {friend});
      await Promise.all([loadMyUser(), loadAllUsers()]);
    } catch (error) {
      alert("Unknown error:\n" + JSON.stringify(error));
    }
  }

  const loadMyUser = async () => {
    try {
      const user = await ledger.pseudoFetchByKey(User, {party: ledger.party()});
      setMyUser(user.argument);
    } catch (error) {
      alert("Unknown error:\n" + error);
    }
  }

  const loadAllUsers = async () => {
    try {
      const allUserContracts = await ledger.fetchAll(User);
      const allUsers = allUserContracts.map((user) => user.argument);
      allUsers.sort((user1, user2) => user1.party.localeCompare(user2.party))
      setAllUsers(allUsers);
    } catch (error) {
      alert("Unknown error:\n" + error);
    }
  }

  useAsyncEffect(loadMyUser, []);
  useAsyncEffect(loadAllUsers, []);

  const props = {
    myUser,
    allUsers,
    onAddFriend: addFriend,
    onRemoveFriend: removeFriend,
    onReloadMyUser: loadMyUser,
    onReloadAllUsers: loadAllUsers,
  };

  return MainView(props);
}

export default MainController;
