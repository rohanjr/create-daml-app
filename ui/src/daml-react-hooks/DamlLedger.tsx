import React, { useReducer, useMemo } from 'react';
import { DamlLedgerContext } from './context';
import Credentials from '../ledger/Credentials';
import * as LedgerStore from './ledgerStore';
import Ledger from '../ledger/Ledger';
import { reducer } from './reducer';

type Props = {
  credentials: Credentials;
}

const DamlLedger: React.FC<Props> = (props) => {
  const [store, dispatch] = useReducer(reducer, LedgerStore.empty);
  const state = useMemo(() => ({
    store,
    dispatch,
    party: props.credentials.party,
    ledger: new Ledger(props.credentials.token),
  }), [props.credentials, store, dispatch])
  return (
    <DamlLedgerContext.Provider value={state}>
      {props.children}
    </DamlLedgerContext.Provider>
  );
}

export default DamlLedger;
