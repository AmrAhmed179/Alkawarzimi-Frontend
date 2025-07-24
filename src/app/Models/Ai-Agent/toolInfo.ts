export class AIToolInfo {
  _id: string; // MongoDB ObjectId as string
  functionName: string;
  functionDescription: string;
  agentId : string;
  agentName : string;
  historyMode : string;
  functionSchemaIsStrict: string;
  functionParameters: string | null; // JSON schema for function parameters, if any
  callGPT: boolean; // Indicates if the tool should call GPT for further processing
  message: string; // Message associated with the tool
  isActive: boolean; // Indicates if the tool should be called
  taskCompleted: boolean; // Indicates if the tool should be called
}
export class Agents{
  _id:string
  name:string
  model:string
  prompt:string
  chatbotId:string
  mainAgent:boolean = false
  maxMemoryLength:number
  routing:Routing[] = []
  promptSections:promptSections = new promptSections()
}
export class Routing{
  intent:string
  taskId:string
}

export class promptSections {
  conversationFlow:string
  crtitcalNote:string
  fewShotExamples:string
  functionCallRules:string
  identity:string
  responseStyle:string
}
