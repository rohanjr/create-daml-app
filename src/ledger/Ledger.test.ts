import { computeCredentials } from './Credentials';
import Ledger from './Ledger';
import { Contract } from './Types';
import { User } from '../daml/User';

const expectData = <T>(contracts: Contract<T>[]) =>
  expect(contracts.map((contract) => contract.data));

it('basic workflow', async () => {
  const testId: number = Math.floor(Math.random() * 1000000);
  const ledger = new Ledger(computeCredentials('user-' + testId.toString()));
  const user: User = {party: ledger.party(), friends: []};
  const userKey = {party: user.party};
  const other: User = {party: 'other-' + testId.toString(), friends: []};
  const otherKey = {party: other.party};
  const userWithFriend: User = {party: user.party, friends: [other.party]};

  const userContract = await ledger.create(User, user);
  expect(userContract.data).toEqual(user);

  const allUsers = await ledger.fetchAll(User);
  expectData(allUsers).toEqual([user]);

  const usersWithoutFriend = await ledger.query(User, {friends: []});
  expectData(usersWithoutFriend).toEqual([user])

  const usersWithFriendOther = await ledger.query(User, {friends: [other.party]});
  expect(usersWithFriendOther).toEqual([]);

  const userLookedupByKey = await ledger.pseudoLookupByKey(User, userKey);
  expect(userLookedupByKey).toBeDefined();
  expect(userLookedupByKey!.data).toEqual(user);

  const otherLookedupByKey = await ledger.pseudoLookupByKey(User, otherKey);
  expect(otherLookedupByKey).toBeUndefined();

  const userFetchedByKey = await ledger.pseudoFetchByKey(User, userKey);
  expect(userFetchedByKey.data).toEqual(user);

  await ledger.exercise(User.AddFriend, userContract.contractId, {friend: other.party});
  const userWithFriendContract = await ledger.pseudoFetchByKey(User, userKey);
  expect(userWithFriendContract.data).toEqual(userWithFriend);

  await ledger.pseudoExerciseByKey(User.RemoveFriend, {party: user.party}, {friend: other.party});
  const userWithoutFriendContract = await ledger.pseudoFetchByKey(User, userKey);
  expect(userWithoutFriendContract.data).toEqual(user);

  await ledger.exercise(User.Delete, userWithoutFriendContract.contractId, {});
  const noUsers = await ledger.fetchAll(User);
  expectData(noUsers).toEqual([]);
});
