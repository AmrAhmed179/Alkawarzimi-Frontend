export class DialogNodes {
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
  text: Text;
  typingDelay: string;
  response_type: string;
}
export class  Text {
  values: string[];
  valueArEn?:ValueEnAR[] = []
  langValues?:LangValue[] = []
  selection_policy: string;
  resOptions?: ResOption;
  goToTaskId?: any;
  template?: string;
  templateConvert?:TemplateConvert = new TemplateConvert()
}

export class TemplateConvert{
  title?: string;
  titleAr?: string;
  titleEn?: string;
  src?:string
  hyperlink?:string
}

export class LangValue{
  text?: string;
  lang?: string;
}
export class ValueEnAR{
  value?:string
  en?:string
  ar?:string
}
export class  ResOption {
  title: string;
  titleAr?: string;
  titleEn?: string;

  description?: any;
  mainOptions: boolean;
  options: OptionModel[] = []
  optionsArEn: OptionModelEnAR[] = []
}
export class  OptionModel {
  label: string;
  value: string;
  iconSrc?: any;
}
export class  OptionModelEnAR {
  labelAr?: string;
  labelEn?: string;
  label: string;
  value: string;
  iconSrc?: any;
}
