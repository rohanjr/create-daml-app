// Generated from DA/Upgrade.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as daml from '@digitalasset/daml-json-types';

export type MetaEquiv<m1_a4Kz, m2_a4KA> = {
}
export const MetaEquiv = <m1_a4Kz, m2_a4KA>(m1_a4Kz: daml.Serializable<m1_a4Kz>, m2_a4KA: daml.Serializable<m2_a4KA>): daml.Serializable<MetaEquiv<m1_a4Kz, m2_a4KA>> => ({
  decoder: () => jtv.object({
  }),
});
