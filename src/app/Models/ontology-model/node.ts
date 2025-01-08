
export class NodeModel {
  entityText: string
  entityId: number
  type?: string
  entityType:string
  node_id: string
  parent?: string
  previous_sibling?: string
  editable: boolean
  frq: number
  domains?: Domain[]
  rang?: string[]
  qTools?: number[]
  templateId: number
  properties: Property[]
  synonmsSet?: SynonmsSet[]
  artificialParent:boolean = false
  extension:boolean = false
}

export interface Domain {
  node_id: any
  PropId: number
  entityId: number
  entityType: string
  entityText: string
  templateId: number
  rejectedCandidate: boolean
}

export interface Property {
  entityText: string
  lang: string
}

export interface SynonmsSet {
  entityText: string
  lang: string
}

export class ClassInfo {
  individuals: number[] = []
  objects: number[]
  entityInfo: EntityInfo[]
  ambClass: boolean = false
}

export interface EntityInfo {
  entityText: string
  stemmedEntity: string
  language: string
  tokens: Token[]
  isReviewed: boolean
  autoTranslation: boolean
}

export interface Token {
  token: string
  stem: string
  stemId: number
  senseId: number
  senseDescribtion: string
}
