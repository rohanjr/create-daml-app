import React from 'react';
import MainView from './MainView';
import Ledger from '../ledger/Ledger';
import { Party, Text } from '../ledger/Types';
import { User } from '../daml/User';
import { Goal } from '../daml/Goal';

type Props = {
  ledger: Ledger;
}

/**
 * React component to control the `MainView`.
 */
const MainController: React.FC<Props> = ({ledger}) => {
  const [myUser, setMyUser] = React.useState<User>({party: '', friends: [], goals: []});
  const [allUsers, setAllUsers] = React.useState<User[]>([]);
  const [myGoals, setMyGoals] = React.useState<Goal[]>([]);

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

  const addGoal = async (pledge: Text, witness: Party | null): Promise<boolean> => {
    try {
      await ledger.pseudoExerciseByKey(User.AddGoal, {party: ledger.party()}, {pledge, witness});
      await Promise.all([loadMyUser(), loadAllUsers(), loadMyGoals()]);
      return true;
    } catch (error) {
      alert("Error adding goal:\n" + JSON.stringify(error) +
        "\nParty: " + ledger.party() + "\nGoal: " + pledge);
      return false;
    }
  }

  const loadMyUser = React.useCallback(async () => {
    try {
      const user = await ledger.pseudoFetchByKey(User, {party: ledger.party()});
      setMyUser(user.data);
    } catch (error) {
      alert("Unknown error:\n" + error);
    }
  }, [ledger]);

  const loadAllUsers = React.useCallback(async () => {
    try {
      const allUserContracts = await ledger.fetchAll(User);
      const allUsers = allUserContracts.map((user) => user.data);
      allUsers.sort((user1, user2) => user1.party.localeCompare(user2.party))
      setAllUsers(allUsers);
    } catch (error) {
      alert("Unknown error:\n" + error);
    }
  }, [ledger]);

  const loadMyGoals = React.useCallback(async () => {
    try {
      const goals = await ledger.query(Goal, {party: ledger.party()});
      setMyGoals(goals.map((goal) => goal.data));
    } catch (error) {
      alert("Error loading your goals:\n" + error);
    }
  }, [ledger]);

  React.useEffect(() => { loadMyUser(); }, [loadMyUser]);
  React.useEffect(() => { loadAllUsers(); }, [loadAllUsers]);
  React.useEffect(() => {
    const interval = setInterval(loadAllUsers, 5000);
    return () => clearInterval(interval);
  }, [loadAllUsers]);
  React.useEffect(() => { loadMyGoals(); }, [loadMyGoals]);

  const props = {
    myUser,
    allUsers,
    myGoals,
    onAddFriend: addFriend,
    onRemoveFriend: removeFriend,
    onAddGoal: addGoal,
    onReloadMyUser: loadMyUser,
    onReloadAllUsers: loadAllUsers,
    onReloadMyGoals: loadMyGoals,
  };

  return MainView(props);
}

export default MainController;
