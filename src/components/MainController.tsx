import React from 'react';
import MainView from './MainView';
import Ledger from '../ledger/Ledger';
import { Party, Text } from '../ledger/Types';
import { User } from '../daml/User';
import { Goal, GoalProposal } from '../daml/Goal';

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
  const [myPendingGoals, setMyPendingGoals] = React.useState<GoalProposal[]>([]);
  const [friendGoals, setFriendGoals] = React.useState<Goal[]>([]);
  const [goalRequests, setGoalRequests] = React.useState<GoalProposal[]>([]);

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
      await Promise.all([loadMyUser(), loadAllUsers(), loadGoals()]);
      return true;
    } catch (error) {
      alert("Error adding goal:\n" + JSON.stringify(error) +
        "\nParty: " + ledger.party() + "\nGoal: " + pledge);
      return false;
    }
  }

  const approveGoal = async (goalRequest: GoalProposal): Promise<boolean> => {
    try {
      await ledger.pseudoExerciseByKey(GoalProposal.Approve, {party: goalRequest.party, pledge: goalRequest.pledge}, {});
      await Promise.all([loadGoals()]);
      return true;
    } catch (error) {
      alert("Error approving goal request:\n" + JSON.stringify(error));
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

  const loadGoals = React.useCallback(async () => {
    try {
      const goals = await ledger.query(Goal, {party: ledger.party()});
      setMyGoals(goals.map((goal) => goal.data));
      const pendingGoals = await ledger.query(GoalProposal, {party: ledger.party()});
      setMyPendingGoals(pendingGoals.map((goal) => goal.data));
      const friendGoals = await ledger.query(Goal, {witness: ledger.party()});
      setFriendGoals(friendGoals.map((goal) => goal.data));
      const reqs = await ledger.query (GoalProposal, {witness: ledger.party()});
      setGoalRequests(reqs.map((req) => req.data));
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
  React.useEffect(() => { loadGoals(); }, [loadGoals]);

  const props = {
    myUser,
    allUsers,
    myGoals,
    myPendingGoals,
    friendGoals,
    goalRequests,
    onAddFriend: addFriend,
    onRemoveFriend: removeFriend,
    onAddGoal: addGoal,
    onApproveGoal: approveGoal,
    onReloadMyUser: loadMyUser,
    onReloadAllUsers: loadAllUsers,
    onReloadMyGoals: loadGoals,
  };

  return MainView(props);
}

export default MainController;
