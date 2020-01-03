import React from 'react';
import MainView from './MainView';
import Ledger from '../ledger/Ledger';
import { Party } from '../ledger/Types';
import { User } from '../daml/User';
import { Post } from '../daml/Post';

type Props = {
  ledger: Ledger;
}

/**
 * React component to control the `MainView`.
 */
const MainController: React.FC<Props> = ({ledger}) => {
  const [myUser, setMyUser] = React.useState<User>({party: '', friends: []});
  const [allUsers, setAllUsers] = React.useState<User[]>([]);
  const [posts, setPosts] = React.useState<Post[]>([]);

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

  const writePost = async (content: string, parties: string): Promise<boolean> => {
    try {
      const sharingWith = parties.replace(/\s/g, "").split(",").map(Party);
      await ledger.pseudoExerciseByKey(User.WritePost, {party: ledger.party()}, {content, sharingWith});
      await Promise.all([loadPosts()]);
      return true;
    } catch (error) {
      alert("Unknown error while writing post:\n" + JSON.stringify(error));
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

  const loadPosts = React.useCallback(async () => {
    try {
      const allPosts = await ledger.fetchAll(Post);
      setPosts(allPosts.map((post) => post.data));
    } catch (error) {
      alert("Error loading posts:\n" + error);
    }
  }, [ledger]);


  React.useEffect(() => { loadMyUser(); }, [loadMyUser]);
  React.useEffect(() => { loadAllUsers(); }, [loadAllUsers]);
  React.useEffect(() => {
    const interval = setInterval(loadAllUsers, 5000);
    return () => clearInterval(interval);
  }, [loadAllUsers]);
  React.useEffect(() => { loadPosts(); }, [loadPosts]);

  const props = {
    myUser,
    allUsers,
    posts,
    onAddFriend: addFriend,
    onRemoveFriend: removeFriend,
    onPost: writePost,
    onReloadMyUser: loadMyUser,
    onReloadAllUsers: loadAllUsers,
  };

  return MainView(props);
}

export default MainController;
