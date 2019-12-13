import {JsonObject, JsonProperty, JsonConvert, ValueCheckingMode, OperationMode} from "json2typescript";
import { Party, Text, TemplateId } from "../ledger/Types";

@JsonObject("Goal")
export class Goal {
  @JsonProperty("party", Party)
  party: Party = '';
  @JsonProperty("pledge", Text)
  pledge: Text = '';
  @JsonProperty("witness", Party, true)
  witness: Party | null = null;

  static templateId: TemplateId = {moduleName: "Goal", entityName: "Goal"};

  static fromJSON(json: unknown): Goal {
    const jsonConvert = new JsonConvert();
    jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;
    return jsonConvert.deserializeObject(json, Goal);
  }

  static toJSON(goal: Goal): unknown {
    const jsonConvert = new JsonConvert();
    jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;
    // TODO(MH): For some reason the conversion to JSON does not work right now.
    jsonConvert.operationMode = OperationMode.DISABLE;
    return jsonConvert.serializeObject<Goal>(goal);
  }
}

@JsonObject("GoalProposal")
export class GoalProposal {
  @JsonProperty("party", Party)
  party: Party = '';
  @JsonProperty("pledge", Text)
  pledge: Text = '';
  @JsonProperty("witness", Party)
  witness: Party = '';

  static templateId: TemplateId = {moduleName: "Goal", entityName: "GoalProposal"};

  static fromJSON(json: unknown): GoalProposal {
    const jsonConvert = new JsonConvert();
    jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;
    return jsonConvert.deserializeObject(json, GoalProposal);
  }

  static toJSON(goalProp: GoalProposal): unknown {
    const jsonConvert = new JsonConvert();
    jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;
    // TODO(MH): For some reason the conversion to JSON does not work right now.
    jsonConvert.operationMode = OperationMode.DISABLE;
    return jsonConvert.serializeObject<GoalProposal>(goalProp);
  }
}
