export interface RelatedFramesAndEligible {
  stem: string
  stemId: number
  senseId: number
  features: Features
  svl: Svl
  sbj: string
  obj: string
  cmp: any
  sbjEntity: any
  objEntity: any
  cmpEntity: any
  eligibleRelation: boolean
}

export interface Features {
  id: number
  name: string
}

export interface Svl {
  id: number
  name: string
}
