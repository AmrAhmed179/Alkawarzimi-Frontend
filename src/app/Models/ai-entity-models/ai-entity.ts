export class ClassAndIndivResponse {
  Classes: string[]
  Individuals: string[]
}

export class FrameAi {
  frame: string
  verbal_noun: string
  subject: string
  object: string
  adverb: string
  synonyms: Synonyms
}

export class Synonyms {
  verbal_noun: string[]
  subject: string[]
  object: string[]
}

export class EntityAI{
  entityText:string
  entityType:string
  select?:boolean = false
  frameType?:string
  frame?:FrameAi
}
export class addedEntityAI {
  entityInfo: EntityInfo[] = [new EntityInfo()]
  _id: number
  parentId: number
  entityType: string
  languageIndex: number
}

export class EntityInfo {
  stemmedEntity: string
  entityText: string
  language: string
}
