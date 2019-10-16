import { Any, JsonObject, JsonProperty, JsonConvert, ValueCheckingMode } from "json2typescript";
import Credentials from './Credentials';
import { Choice, Contract, ContractId, Template } from './Types';


@JsonObject("Ledger.Response")
class LedgerResponse {
  @JsonProperty("status", Number)
  status: number = -1;
  @JsonProperty("result", Any)
  result: unknown = undefined;
}

@JsonObject("Ledger.Error")
class LedgerError {
  @JsonProperty("status", Number)
  status: number = -1;
  @JsonProperty("errors", [String])
  errors: string[] = [];
}

class Ledger {
  readonly credentials: Credentials;

  constructor(credentials: Credentials) {
    this.credentials = credentials;
  }

  private async submit(method: string, payload: unknown): Promise<unknown> {
    const jsonConvert = new JsonConvert();
    jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;
    const httpResponse = await fetch(method, {
      body: JSON.stringify(payload),
      headers: {
        'Authorization': 'Bearer ' + this.credentials.password,
        'Content-type': 'application/json'
      },
      method: 'post',
    });
    const json = await httpResponse.json();
    if (!httpResponse.ok) {
      throw jsonConvert.deserialize(json, LedgerError);
    }
    const ledgerResponse = jsonConvert.deserializeObject(json, LedgerResponse);
    return ledgerResponse.result;
  }

  async query<T>(template: Template<T>, query: unknown): Promise<Contract<T>[]> {
    const payload = {"%templates": [template.templateId]};
    Object.assign(payload, query);
    const json = await this.submit('contracts/search', payload);
    if (!(json instanceof Array)) {
      throw new Error('query: submit did not return an array');
    }
    const contracts = json.map((jsonContract) => Contract.fromJSON<T>(template, jsonContract));
    return contracts;
  }

  async fetchAll<T>(template: Template<T>): Promise<Contract<T>[]> {
    return this.query(template, {});
  }

  async pseudoLookupByKey<T>(template: Template<T>, key: unknown): Promise<Contract<T> | undefined> {
    const contracts = await this.query(template, key);
    if (contracts.length > 1) {
      throw new Error("pseudoLookupByKey: query returned multiple contracts");
    }
    return contracts[0];
  }

  async pseudoFetchByKey<T>(template: Template<T>, key: unknown): Promise<Contract<T>> {
    const contract = await this.pseudoLookupByKey(template, key);
    if (contract === undefined) {
      throw new Error("pseudoFetchByKey: query returned no contract");
    }
    return contract;
  }

  async exercise<T, C>(choice: Choice<T, C>, contractId: ContractId<T>, argument: C): Promise<unknown> {
    const payload = {
      templateId: choice.template.templateId,
      contractId: contractId.toJSON(),
      choice: choice.choiceName,
      argument: choice.toJSON(argument),
    };
    const json = await this.submit('command/exercise', payload);
    return json;
  }

  async pseudoExerciseByKey<T, C>(choice: Choice<T, C>, key: unknown, argument: C): Promise<unknown> {
    const contract = await this.pseudoFetchByKey(choice.template, key);
    return this.exercise(choice, contract.contractId, argument);
  }

  async create<T>(template: Template<T>, argument: T): Promise<Contract<T>> {
    const payload = {
      templateId: template.templateId,
      argument: template.toJSON(argument),
    }
    const json = await this.submit('command/create', payload);
    const contract = Contract.fromJSON<T>(template, json);
    return contract;
  }

  static Error = LedgerError;
}

export default Ledger;
