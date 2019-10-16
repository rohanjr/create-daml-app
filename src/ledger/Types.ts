import { Any, JsonObject, JsonProperty, JsonConvert, ValueCheckingMode, OperationMode } from "json2typescript";

@JsonObject("TemplateId")
export class TemplateId {
  @JsonProperty("packageId", String)
  packageId?: string = '';
  @JsonProperty("moduleName", String)
  moduleName: string = '';
  @JsonProperty("entityName", String)
  entityName: string = '';
}

export interface Template<T> {
  templateId: TemplateId;
  fromJSON(json: unknown): T;
  toJSON(t: T): unknown;
}

export interface Choice<T, C> {
  template: Template<T>;
  choiceName: string;
  toJSON(c: C): unknown;
}

export type Party = string;
export const Party = String;

type AnyContractId = string;
const AnyContractId = String;

export class ContractId<T> {
  readonly contractId: AnyContractId;

  private constructor(contractId: AnyContractId) {
    this.contractId = contractId;
  }

  static fromJSON<T>(contractId: AnyContractId): ContractId<T> {
    return new ContractId<T>(contractId);
  }

  toJSON = (): AnyContractId => this.contractId;
}

@JsonObject("AnyContract")
class AnyContract {
  @JsonProperty("observers", [Party])
  observers: Party[] = [];
  @JsonProperty("agreementText", String)
  agreementText: string = '';
  @JsonProperty("signatories", [Party])
  signatories: Party[] = [];
  @JsonProperty("key", Any, true)
  key: unknown = undefined;
  @JsonProperty("contractId", AnyContractId)
  contractId: AnyContractId = '';
  @JsonProperty("templateId", TemplateId)
  templateId: TemplateId = new TemplateId();
  @JsonProperty("witnessParties", [Party])
  witnessParties: Party[] = [];
  @JsonProperty("argument")
  argument: unknown = undefined;
  @JsonProperty("workflowId", String, true)
  workflowId?: string = '';
}

export class Contract<T> {
  observers: Party[] = [];
  agreementText: string = '';
  signatories: Party[] = [];
  key: unknown = undefined;
  contractId: ContractId<T>;
  templateId: TemplateId = new TemplateId();
  witnessParties: Party[] = [];
  argument: T;
  workflowId?: string = undefined;

  private constructor(contractId: ContractId<T>, argument: T) {
    this.contractId = contractId;
    this.argument = argument;
  }

  static fromJSON<T>(templateType: Template<T>, json: unknown): Contract<T> {
    const jsonConvert = new JsonConvert();
    jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;
    jsonConvert.operationMode = OperationMode.ENABLE;
    const anyContract = jsonConvert.deserializeObject(json, AnyContract);
    const contractId = ContractId.fromJSON<T>(anyContract.contractId);
    const argument = templateType.fromJSON(anyContract.argument);
    const contract = new Contract<T>(contractId, argument);
    contract.observers = anyContract.observers
    contract.agreementText = anyContract.agreementText
    contract.signatories = anyContract.signatories
    contract.key = anyContract.key
    contract.templateId = anyContract.templateId
    contract.witnessParties = anyContract.witnessParties
    contract.workflowId = anyContract.workflowId
    return contract;
  }
}
