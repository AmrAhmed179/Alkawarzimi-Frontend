import { EntityModel } from "./EntityCatogeryModel"

export class VerbModel {
  verb: string
  lang: string
  senseId: number
  generated: boolean
  description: string
  function: number
  synonyms: string[]
  frq: number
  frames: Frame[]
  found: boolean
  templateId: number
  verbs: any
  synonmsSet: any
}

export class Frame {
  verb: string
  lang: string
  senseId: number
  argumentMappingObject: any
  features: any
  entityId: string
  parentId: string
  type: string = 'xx'
  propertyFrame: boolean
  LinkedArgs: any[] = []
  propSubClasses: PropSubClasses[] = []
  attachedProperty: any
  sbj: Sbj[] = []
  sbjType: SbjType = new SbjType()
  sbjMandatory: number
  obj: Obj[] = []
  objModyfier: ObjModyfier = new ObjModyfier()
  objType: ObjType = new ObjType()
  cmp: Cmp[] = []
  cmpModyfier: CmpModyfier = new CmpModyfier()
  cmpType: CmpType = new ObjType()
  adv: Adv[] = []
  frameFeat: FrameFeat = new FrameFeat()
  frameCoreAttachments: FrameCoreAttachments[] = []
  error: boolean
  Informative: boolean = false
  negative: boolean = false
  isType: boolean = false
  pastEvent: boolean = false
  ignoreTellAbout: boolean = false
  ignoreExplain: boolean = false
  synonyms: number
  GenReson: any
  SemanticReson: any
  SrcFrameId: number
  SemanticSrcFrameId: number
  implied: boolean
  impliedFrameId: number
  impliedArgumentMapping: any
  entity?:EntityModel = new EntityModel()
}

export class Sbj {
  i: number
  s: string
  t: string
}

export class SbjType {
  ratPlus: boolean = false
  ratMinus: boolean = false
  place: boolean = false
  time: boolean = false
}

export class Obj {
  i: number
  s: string
  t: string
}

export class ObjType {
  ratPlus: boolean = false
  ratMinus: boolean = false
  place: boolean = false
  time: boolean = false
}

export class Cmp {
  i: number
  s: string
  t: string
}
export class CmpType {
  ratPlus: boolean = false
  ratMinus: boolean = false
  place: boolean = false
  time: boolean = false
}

export class Adv
{
  i: number
  s: string
  t: string
}
export class FrameFeat {
  request: boolean = false
  requestGain: boolean= false
  relObj: boolean= false
  relSbj: boolean= false
  domaninEllipsis: boolean= false
  ellipsisExceptObj: boolean= false
  sbjMandatory: boolean= false
  framePropLinkedToObj: boolean= false
  genObjSbj: boolean= false
  genSbjObj: boolean= false
  exactObject: boolean= false
}

export class PropSubClasses {
  subClassId: number
  propertyId: number
}

export class CmpModyfier {
  preps: string[] = []
  modifiers: any
}
export class ObjModyfier {
  preps: string[] = []
  modifiers: any
}

export class FrameCoreAttachments {
  predicateId: number
  predicateType: string
  propSubClasses: any
  objectValue: any
  objectEntitiesValues: ObjectEntitiesValue[] = []
}

export class ObjectEntitiesValue {
  entityId: number
  entityType: string
  value: string
  nValue: number
  negative: boolean = false
}

