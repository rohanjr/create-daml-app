import React from 'react';
import MainView from './MainView';
import { Party } from '@digitalasset/daml-json-types';
import { User } from '../daml/User';
import { useParty, usePseudoExerciseByKey, usePseudoFetchByKey, useQuery } from '../daml-react-hooks';

type Props = {
}

/**
 * React component to control the `MainView`.
 */
const MainController: React.FC<Props> = ({}) => {
  const [myUser, setMyUser] = React.useState<User>({party: '', friends: []});
  const [allUsers, setAllUsers] = React.useState<User[]>([]);

  const party = useParty();
  const user = usePseudoFetchByKey(User, () => ({party}), [party]);
  const allUserContracts = useQuery(User).contracts;

  const [exerciseAddFriend, _loadingAddFriend] = usePseudoExerciseByKey(User.AddFriend);
  const [exerciseRemoveFriend, _loadingRemoveFriend] = usePseudoExerciseByKey(User.RemoveFriend);

  const addFriend = async (friend: Party): Promise<boolean> => {
    try {
      await exerciseAddFriend({party}, {friend});
      await Promise.all([loadMyUser(), loadAllUsers()]);
      return true;
    } catch (error) {
      alert("Unknown error:\n" + JSON.stringify(error));
      return false;
    }
  }

  const removeFriend = async (friend: Party): Promise<void> => {
    try {
      await exerciseRemoveFriend({party}, {friend});
      await Promise.all([loadMyUser(), loadAllUsers()]);
    } catch (error) {
      alert("Unknown error:\n" + JSON.stringify(error));
    }
  }

  const loadMyUser = React.useCallback(async () => {
    try {
      if (user.contract) {
        setMyUser(user.contract.payload);
      } else {
        alert("User not found\n");
      }
      // TODO(RJR): Handle null contract and loading flag
    } catch (error) {
      alert("Unknown error:\n" + error);
    }
  }, []);

  const loadAllUsers = React.useCallback(async () => {
    try {
      // TODO(RJR): Handle loading == true
      const allUsers = allUserContracts.map((user) => user.payload);
      allUsers.sort((user1, user2) => user1.party.localeCompare(user2.party))
      setAllUsers(allUsers);
    } catch (error) {
      alert("Unknown error:\n" + error);
    }
  }, []);

  React.useEffect(() => { loadMyUser(); }, [loadMyUser]);
  React.useEffect(() => { loadAllUsers(); }, [loadAllUsers]);
  React.useEffect(() => {
    const interval = setInterval(loadAllUsers, 5000);
    return () => clearInterval(interval);
  }, [loadAllUsers]);

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
