import { encode } from 'jwt-simple';

export const LEDGER_ID: string = 'create-daml-app-sandbox';

export const APPLICATION_ID: string = 'create-daml-app';

export const SECRECT_KEY: string = 'secret';

export function passwordFor(party: string): string {
  const payload = {
    ledgerId: LEDGER_ID,
    applicationId: APPLICATION_ID,
    party,
  };
  return encode(payload, SECRECT_KEY, 'HS256');
}

export type Credentials = {
  username: string;
  password: string;
}

export default Credentials;
