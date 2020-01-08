import { encode, decode } from 'jwt-simple';

export const LEDGER_ID: string = 'create-daml-app-sandbox';

export const APPLICATION_ID: string = 'create-daml-app';

export const SECRET_KEY: string = 'secret';

export function computeToken(party: string): string {
  const payload = {
    ledgerId: LEDGER_ID,
    applicationId: APPLICATION_ID,
    party,
  };
  return encode(payload, SECRET_KEY, 'HS256');
}

export type Credentials = {
  party: string;
  token: string;
}

export const computeCredentials = (party: string): Credentials => {
  const token = computeToken(party);
  return {party, token};
}

/**
 * Check that the party in the token matches the party of the credentials and
 * that the ledger ID in the token matches `LEDGER_ID`.
 */
export const preCheckCredentials = ({party, token}: Credentials): string | null => {
  const decoded = decode(token, '', true);
  if (!decoded.ledgerId || decoded.ledgerId !== LEDGER_ID) {
    return 'The password is not valid for DAVL.';
  }
  if (!decoded.party || decoded.party !== party) {
    return 'The password is not valid for this user.';
  }
  return null;
}

export default Credentials;
