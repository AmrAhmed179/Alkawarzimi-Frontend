import { DataObject } from "./Lexicon";

export interface frame {
     verb: string;
//     lang: string;
     senseId: number;
     argumentMappingObject: ArgumentMapping;
     features: DataObject;
//     entityId: string;
//     parentId: string;
//     type: string;
//     propertyFrame: boolean;
//     //linkedArgs: LinkedArg[];
//     propSubClasses: propSubClass[];
//     attachedProperty: attachedProperty;
//     sbj: frameEntity[];
//     sbjType: argType;
//     sbjMandatory: number;
//     obj: frameEntity[];
//     objModyfier: ArgModifier;
//     objType: argType;
//     cmp: frameEntity[];
//     cmpModyfier: ArgModifier;
//     cmpType: argType;
//     adv: frameEntity[];
//     frameFeat: frameFeat;
//     frameCoreAttachments: FrameCoreAttachment[];
//     error: boolean;
    informative: boolean;
    negative: boolean;
    isType: boolean;
    pastEvent: boolean;
    ignoreTellAbout: boolean;
    ignoreExplain: boolean;
    // synonyms: number;
    // genReson: string;
    // semanticReson: string;
    // srcFrameId: number;
    // semanticSrcFrameId: number;
    // implied: boolean;
    // impliedFrameId: number;
    // impliedArgumentMapping: ArgumentMapping;
}

export interface ArgumentMapping {
    sbj: string;
    obj: string;
    cmp: string;
}

export interface restriction {
    predicateId: number;
    name: string;
    valueId: number;
    value: string;
    vOperator: number;
}