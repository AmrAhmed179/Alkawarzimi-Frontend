export class CorpusIntent {
  _id: number
  header: string
  body: string
  tweetId: string
  userName: string
  profileUrl: string
  isReviewed: boolean
  annotatedEntities: any[]
  pattern: Pattern[]
  type: number
  deletedTag: number
  deletedPatternTag: number
  IntentType: number
  created: string
  answerResult: number
  deleted: boolean
  responseTypeText: boolean
  categoryId: number
}

export class Pattern {
  patternId: string
  answer: string
}
export class EntityModelView {
  _id: number
  entityType: string
  entityInfo: EntityInfo[]
  parentId: number
  senseId: number
  templateId: number
  female: boolean
  errorInStem: boolean
}

export class EntityInfo {
  entityText: string
  stemmedEntity: string
  language: string
  tokens: any
  isReviewed: boolean
  autoTranslation: boolean
}
