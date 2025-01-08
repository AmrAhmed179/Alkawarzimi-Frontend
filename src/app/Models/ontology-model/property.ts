export class PropertyNode{
  entityText: string
  entityId: number
  type?: string
  node_id: string
  parent?: string
  previous_sibling?: string
  editable: boolean
  frq: number
  domains?: Domain[]
  rang?: string[]
  qTools?: number[]
  templateId: number
  properties?: Property[]
  synonmsSet?: SynonmsSet[]
  children?:PropertyNode[] = []

}

export class Domain {
  node_id?: string
  PropId: number
  entityId: number
  entityType: string
  entityText: string
  templateId: number
  rejectedCandidate: boolean
}

export class Property {
  entityText: string
  lang: string
}

export class SynonmsSet {
  entityText: string
  lang: string
}
