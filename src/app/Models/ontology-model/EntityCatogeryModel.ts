export class EntityCatogeryModel{
  id: number;
  title: string;
  genre_name: string;
  genre_count: number;
}
export class EntityModel {
  _id: number;
  entityType: string;
  entityInfo: EntityInfo[];
  parentId: number;
  ambClass: boolean;
  trigger: boolean;
  talkAboutMenu: boolean;
  paraphraseEntities: any[];
  frame: Frame;
  cmp?: any;
  sbj?: any;
  obj?: any;
  features?: any;
  senseId: number;
  type: string;
  verb: string;
  templateId: number;
  female: boolean;
  errorInStem: boolean;
  categoryId: string;
  children:EntityModel[] = []
}
export class Frame {
  GenReson?:string
  Informative: boolean;
  negative: boolean;
  isType: boolean;
  ignoreTellAbout: boolean;
  pastEvent: boolean;
}
export class EntityInfo {
  entityText: string;
  stemmedEntity: string;
  language: string;
  tokens?: any;
  isReviewed: boolean;
  autoTranslation: boolean;
}
