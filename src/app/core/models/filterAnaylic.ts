export class filterAnalytical{
  //startDate:Date = new Date(new Date().setHours(0,0,0,0))
  startDate:string
  //endDate:Date = new Date(new Date().setHours(23,59,59,0))
  endDate:string
  chatBotId:number = 0
  filter:RequestFilter[] = []
  search:string
  length:number = 10
  start:number = 0
  userId:string
  projectId:string = ""
  modeAgent:boolean = false
}
export class RequestFilter{
  id:string;
  text:string;
  type:number
}

export class formValueMapToForm{
  intents:string[]  []
  services:string[] = []
  entities:string[] =[]
  search:String   = ''
  userId:String   = ''
  projectId:string = ""
}

export class SurveyFilter{
  //startDate:Date = new Date(new Date().setHours(0,0,0,0))
  startDate:string = ''
  //endDate:Date = new Date(new Date().setHours(23,59,59,0))
  endDate:string =''
  chatBotId:number = 0
  surveyType:string = ''
}

export class SassProjects{
  _id: string
  brandInfo: BrandInfo
  projectType: number
}

export class BrandInfo {
  name: string
  description: string
  image: string
  brandNameAlternatives: string[]
  categories: any
}
