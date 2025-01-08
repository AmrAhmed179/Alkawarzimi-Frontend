export class DialogNodesConvert {
  type: string;
  disable: boolean;
  intentId: string;
  dialog_node: string;
  title?: any;
  parent?: any;
  description?: any;
  next_step?: any;
  conditionGroup: any;
  event_name?: any;
  output: Output[] = []
  display_policy: string;
  filled?: any;
  behavior?: any;
  notFilled?: any;
  ignoreOldValue: boolean;
  sourceBot?: any;
  serviceObject?: any;
  triggeredObject: any;
  expProcess: any;
  executeService?: any;
  services: any;
  variables: any;
  previous_sibling?: any;
  variable?: any;
  focus?: any;
  reset: boolean;
  isList: boolean;
  required: boolean;
  digressionResponse?: any;
  deleteServiceObject?: any;
  created: string;
  updated: string;
}
export class  Output {
  text:TextModel = new TextModel()
  typingDelay: string;
  response_type: string;
}
export class  TextModel {
  values?: ValueEnAR[] = []
  selection_policy: string = ''
  resOptions?: ResOption = new ResOption()
  goToTaskId?: any;
  template?: string;
}
export class ValueEnAR{
  en?:string
  ar?:string
}
export class  ResOption {
  titleAr?: string;
  titleEn?: string;
  description?: any;
  mainOptions: boolean;
  options: Option[] =[]
}
export class  Option {
  labelAr: string;
  labelEn: string;
  value: string;
  iconSrc?: any;
}
