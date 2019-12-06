import {JsonObject, JsonProperty, JsonConvert, ValueCheckingMode, OperationMode} from "json2typescript";
import { Party, Text, Int, TemplateId } from "../ledger/Types";

@JsonObject("Goal")
export class Goal {
  @JsonProperty("party", Party)
  party: Party = '';
  @JsonProperty("pledge", Text)
  pledge: Text = '';
  @JsonProperty("duration", Int)
  duration: Int = 0;

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