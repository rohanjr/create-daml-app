// Not generated, but should be using daml2ts.
import * as daml from "../ledger/Types";
import * as jtv from '@mojotech/json-type-validation';

const moduleName = 'User';
const templateId = (entityName: string): daml.TemplateId => ({moduleName, entityName});

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


export type User = {
  party: daml.Party;
  friends: daml.Party[];
};
export const User: daml.Template<User> & {
  Archive: daml.Choice<User, Archive>;
  Delete: daml.Choice<User, Delete>;
  AddFriend: daml.Choice<User, AddFriend>;
  RemoveFriend: daml.Choice<User, RemoveFriend>;
} = {
  templateId: templateId('User'),
  decoder: () => jtv.object({
    party: daml.Party.decoder(),
    friends: daml.List(daml.Party).decoder()
  }),
  Archive: {
    template: () => User,
    choiceName: 'Archive',
    decoder: Archive.decoder,
  },
  Delete: {
    template: () => User,
    choiceName: 'Delete',
    decoder: Delete.decoder,
  },
  AddFriend: {
    template: () => User,
    choiceName: 'AddFriend',
    decoder: AddFriend.decoder,
  },
  RemoveFriend: {
    template: () => User,
    choiceName: 'RemoveFriend',
    decoder: RemoveFriend.decoder,
  },
};
daml.registerTemplate(User);
