export class EntityBehaviourModel {
  onTree: boolean
  dataProperty: boolean
  cmp: Cmp[]
  obj: Obj[]
  sbj: Sbj[]
}

export interface Cmp {
  id: number
  text: string
}

export interface Obj {
  id: number
  text: string
}

export interface Sbj {
  id: number
  text: string
}
export class BehaviourModel{
  id: number
  text: string
}
