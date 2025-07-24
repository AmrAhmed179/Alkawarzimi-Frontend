export class Intent {
  name: string;
  intentId: string;
  examples: Example[];
  proccessingMode: boolean;
  knowledge: boolean;
  responseMode: number;
}
export class Example {
  exId: number;
  language: string;
  text: string;
  pattern?: any;
  inconsistency: boolean;
  type?: any;
  state?: any;
  comment?: any;
  answerState: boolean;
  initialAnswerState: boolean;
  difference: boolean;
  flow: boolean;
  testedBefore: boolean;
}
export class IntentSettings {
  _id: number;
  name: string;
  intentId: string;
  description?: any;
  category: string;
  returnAfterDigression: boolean;
  stopDigression: boolean;
  allawReturnToPreviousFlow: boolean;
  mainTaskCondations?: any;
  mainTask: boolean;
  responseMode: number;
  triggeringUrl?: any;
  hasTrigger: boolean;
  adFlow: boolean;
  changeLanguage: boolean;
  changeLanguageTo?: any;
  endConversation: boolean;
  linkedFact?: any;
  sideTalk: boolean;
  serviceFlow: boolean;
  statelessFlow: boolean;
  stopPostResponse: boolean;
  callPostResponse: boolean;
}

export class AllTask {
  name: string
  intentId: string
}
