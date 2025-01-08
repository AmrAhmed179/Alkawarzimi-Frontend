export interface CreateEntityModel {
  entityInfo: EntityInfo[]
  _id: number
  parentId: number
  entityType: string
  languageIndex: number
}

export interface EntityInfo {
  stemmedEntity: string
  entityText: string
  language: string
}
