// Generated from Daml/Trigger/LowLevel.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as daml from '@digitalasset/daml-json-types';

export type CompletionStatus = 
  |  { tag: 'Failed'; value: CompletionStatus_NS.Failed }
  |  { tag: 'Succeeded'; value: CompletionStatus_NS.Succeeded }
export const CompletionStatus: daml.Serializable<CompletionStatus> = ({
  decoder: () => jtv.oneOf<CompletionStatus>(
    jtv.object({tag: jtv.constant('Failed'), value: jtv.lazy(() => CompletionStatus_NS.Failed.decoder())}),
    jtv.object({tag: jtv.constant('Succeeded'), value: jtv.lazy(() => CompletionStatus_NS.Succeeded.decoder())}),
  )
});

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CompletionStatus_NS {
  export type Failed = {
    status: daml.Int;
    message: string;
  }
} //namespace CompletionStatus_NS

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CompletionStatus_NS {
  export const Failed: daml.Serializable<Failed> = ({
    decoder: () => jtv.object({
      status: daml.Int.decoder(),
      message: daml.Text.decoder(),
    }),
  });
} //namespace CompletionStatus_NS


// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CompletionStatus_NS {
  export type Succeeded = {
    transactionId: TransactionId;
  }
} //namespace CompletionStatus_NS

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CompletionStatus_NS {
  export const Succeeded: daml.Serializable<Succeeded> = ({
    decoder: () => jtv.object({
      transactionId: TransactionId.decoder(),
    }),
  });
} //namespace CompletionStatus_NS


export type Completion = {
  commandId: CommandId;
  status: CompletionStatus;
}
export const Completion: daml.Serializable<Completion> = ({
  decoder: () => jtv.object({
    commandId: CommandId.decoder(),
    status: CompletionStatus.decoder(),
  }),
});

export type CommandId = {
  unpack: string;
}
export const CommandId: daml.Serializable<CommandId> = ({
  decoder: () => jtv.object({
    unpack: daml.Text.decoder(),
  }),
});

export type EventId = {
  unpack: string;
}
export const EventId: daml.Serializable<EventId> = ({
  decoder: () => jtv.object({
    unpack: daml.Text.decoder(),
  }),
});

export type TransactionId = {
  unpack: string;
}
export const TransactionId: daml.Serializable<TransactionId> = ({
  decoder: () => jtv.object({
    unpack: daml.Text.decoder(),
  }),
});
