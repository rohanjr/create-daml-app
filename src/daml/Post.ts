import {JsonObject, JsonProperty, JsonConvert, ValueCheckingMode, OperationMode} from "json2typescript";
import { Party, Text, TemplateId } from "../ledger/Types";

@JsonObject("Post")
export class Post {
  @JsonProperty("author", Party)
  author: Party = '';
  @JsonProperty("content", Text)
  content: Text = '';
  @JsonProperty("sharingWith", [Party])
  sharingWith: Party[] = [];

  static templateId: TemplateId = {moduleName: "Post", entityName: "Post"};

  static fromJSON(json: unknown): Post {
    const jsonConvert = new JsonConvert();
    jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;
    return jsonConvert.deserializeObject(json, Post);
  }

  static toJSON(post: Post): unknown {
    const jsonConvert = new JsonConvert();
    jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;
    // TODO(MH): For some reason the conversion to JSON does not work right now.
    jsonConvert.operationMode = OperationMode.DISABLE;
    return jsonConvert.serializeObject<Post>(post);
  }
}
