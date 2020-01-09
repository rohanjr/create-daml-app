// Not generated, but should be using daml2ts.
import * as daml from "../ledger/Types";
import * as jtv from '@mojotech/json-type-validation';
import packageId from './PackageId';

const moduleName = 'User';
const templateId = (entityName: string): daml.TemplateId => ({packageId, moduleName, entityName});

export type AddFriend = {
  friend: daml.Party;
};
export const AddFriend: daml.Serializable<AddFriend> = ({
  decoder: () => jtv.object({
    friend: daml.Party.decoder(),
  }),
});

export type RemoveFriend = {
  friend: daml.Party;
};
export const RemoveFriend: daml.Serializable<RemoveFriend> = ({
  decoder: () => jtv.object({
    friend: daml.Party.decoder(),
  }),
});

export type Delete = {
};
export const Delete: daml.Serializable<Delete> = ({
  decoder: () => jtv.object({
  }),
});

export type Archive = {
};
export const Archive: daml.Serializable<Archive> = ({
  decoder: () => jtv.object({
  }),
});


const getContractIdDecoder: () => () => jtv.Decoder<daml.ContractId<User>> = () => () => {
  return daml.ContractId(User).decoder();
}
export type User = {
  party: daml.Party;
  friends: daml.Party[];
};
export const User: daml.Template<User> & {
  Archive: daml.Choice<User, Archive, daml.Unit>;
  Delete: daml.Choice<User, Delete, daml.Unit>;
  AddFriend: daml.Choice<User, AddFriend, daml.ContractId<User>>;
  RemoveFriend: daml.Choice<User, RemoveFriend, daml.ContractId<User>>;
} = {
  templateId: templateId('User'),
  keyDecoder: daml.Party.decoder,
  decoder: () => jtv.object({
    party: daml.Party.decoder(),
    friends: daml.List(daml.Party).decoder()
  }),
  Archive: {
    template: () => User,
    choiceName: 'Archive',
    argumentDecoder: Archive.decoder,
    resultDecoder: daml.Unit.decoder,
  },
  Delete: {
    template: () => User,
    choiceName: 'Delete',
    argumentDecoder: Delete.decoder,
    resultDecoder: daml.Unit.decoder,
  },
  AddFriend: {
    template: () => User,
    choiceName: 'AddFriend',
    argumentDecoder: AddFriend.decoder,
    resultDecoder: getContractIdDecoder(),
  },
  RemoveFriend: {
    template: () => User,
    choiceName: 'RemoveFriend',
    argumentDecoder: RemoveFriend.decoder,
    resultDecoder: getContractIdDecoder(),
  },
};
daml.registerTemplate(User);
