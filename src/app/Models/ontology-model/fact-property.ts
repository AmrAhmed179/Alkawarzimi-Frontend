import { EntityModel } from "./EntityCatogeryModel"

export class FactProperties {
  entityId: number
  subjectId: string
  predicateId: number
  sourcePredicateId: number
  predicateType: string
  linkedClass: number
  linkedClassText: string
  propSubClasses: any[] = []
  linkedFrames: number[] = []
  linkedFramesEntity: EntityModel[] = []
  docId: any
  type: string
  node_id: string
  parent: string
  previous_sibling: any
  editable: boolean
  required: boolean
  reset: boolean
  list: boolean
  dummy: boolean
  listValues: boolean
  ask: boolean
  dataTypeId: number
  restrictions: any
  responseMode: number
  response: Response = new Response()
  ignoreTellAbout: boolean
  stopPostResponse: boolean
  paraPhraseFact: boolean
  tellAboutOnly: boolean
  dialog_nodes: any
  flowDiagram: any
  xmlFlow: any
  patternIntentId: any
  inserted: boolean
  entity?:EntityModel
  nodes:FactProperties[] = []
  treeText:string
  propertyIndex:PropertiesIndex = new PropertiesIndex()
  subClassEntityArray?:EntityModel[] = []
}

export class Response {
  value: Value[] = []
  objectEntitiesValues: ObjectEntitiesValue[]
  mediaResponse: MediaResponse
  goToTaskId: any
  responseType: number
  actionType: number
  actionSubType: number
}
export class ObjectEntitiesValue {
  entityId: number
  entityType: string
  value: Value[]
  nValue: number
  negative: boolean
}
export class MediaResponse {
  title: Title[] = []
  src: string
  link: string
  type: string
}

export class Title {
  lang: string
  value: any
}
export class Value {
  lang: string
  value: any
}

export class PropertiesIndex {
  entityText: string
  entityId: number
  type: any
  node_id: string
  parent: any
  previous_sibling: any
  editable: boolean
  frq: number
  domains: any
  rang: any
  qTools: any
  templateId: number
  properties: any
  synonmsSet: any
}
export class LinkedArg {
  type: string
  lId: number
  attache: boolean
}
