import { DataObject } from "./Lexicon";
import { frame } from "./VerbFrames";

export interface Entities {
    _id: number;
    entityType: string;
    parentId: number;
    entityInfo: EntityInfo[];
    ambClass: boolean;
    trigger: boolean;
    paraphraseEntities: number[];
    frame: frame;
    templateId:number;
    female:boolean;
    errorInStem: boolean,
    categoryId:string;
    sbj?: string;
    obj?: string;
    cmp?: string;
    verb?: string;
    senseId?:number
    features?:DataObject
}

export interface EntityInfo {

    entityText: string;
    stemmedEntity: string;
    language: string;
    tokens: Token[];
    isReviewed: boolean;
    autoTranslation: boolean;
}

export interface Token {
    token: string;
    stem: string;
    stemId: number;
    senseId: number;
    senseDescribtion: string;
}

export interface objectInquiries {
    describtion: string;
    newInstance: string;
    modifyInstance: string;
    unCompleteInstance: string;
    exitInstance: string;
    objectCompleted: string;
    instanceNeedModification: string;
    valueMessage: string;
    lang: string;
}