
export class IntentModel {
  _id: number
  name?: string
  intentId: string
  description: any
  examples: Example[]
  inconsistency: boolean
  eventTask: number
  category: string
  taskType: any
  sideTalk: boolean
  serviceFlow: boolean
  statelessFlow: boolean
  stopPostResponse: boolean
  callPostResponse: boolean
  dialog_nodes: DialogNode[] = []
  created: string
  updated: string
  deleted: boolean
  knowledge: boolean
  problem: boolean
  sourceBot: any
  mainTask: boolean
  mainTaskCondations: any
  proccessingMode: boolean
  matchingMode: number
  returnAfterDigression: boolean
  stopDigression: boolean
  responseMode: number
  flowDiagram?: any[]
  xmlFlow: any
  triggeringUrl?: any[]
  hasTrigger: boolean
  endConversation: boolean
  changeLanguage: boolean
  stepBack: boolean
  securityTask: boolean
  changeLanguageTo: any
  adFlow: boolean
  linkedFact?: LinkedFact
  taskContext: any
}

export class Example {
  exId: number
  language: string
  text: string
  pattern: Pattern[]
  inconsistency: boolean
  type: any
  state: any
  comment: any
  answerState: boolean
  initialAnswerState: boolean
  difference: boolean
  flow: boolean
  testedBefore: boolean
}

export class Pattern {
  entityId: number
  parentId: number
  entityText: string
  entityType: string
}

export class DialogNode {
  type: string
  disable: boolean
  intentId: string
  dialog_node: string
  title: any
  parent: any
  description: any
  next_step: any
  conditionGroup?: any[] = []
  event_name: any
  output?: Output[] = []
  display_policy: string
  filled: any
  behavior: any
  notFilled: any
  ignoreOldValue: boolean
  sourceBot: any
  serviceObject: any
  triggeredObject?: any[] =[]
  expProcess?: any[] = []
  executeService: any
  services?: any[] = []
  variables?: any[] = []
  previous_sibling: any
  variable: any
  focus: any
  reset: boolean
  isList: boolean
  required: boolean
  digressionResponse: any
  deleteServiceObject: any
  created: string
  updated: string
}

export class Output {
  text: Text
  typingDelay: string
  response_type: string
}

export class Text {
  values: string[]
  selection_policy: string
  resOptions?: ResOptions
  goToTaskId: any
  template: any
}

export class ResOptions {
  title: string
  description: any
  mainOptions: boolean
  options: Option[]
}

export class Option {
  label: string
  value: any
  iconSrc: any
}

export class LinkedFact {
  entityId: number
  subjectId: string
  predicateId: number
  node_id: string
  responseMode: number
}
