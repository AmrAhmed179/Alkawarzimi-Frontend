

export class Classes {
    classId: number;
    name: string;
    caseClass: boolean;
    arbClassName: string;
    inquiries: objectInquiries[];
    properties: ClassProp[];
    languageIndex: number;
}

export class ClassProp {
    propId: number;
    key: string;
    names: PropName[];
    inquiries: PropInquery[] = [];
    selection_policy: string;
    dataTypeId: string;
    required: boolean;
    reset: boolean;
    list: boolean;
    dummy: boolean;
    listValues: boolean;
    ask: boolean;
    caseProp: boolean;
    restrictions: restriction[];
    nameLanguageIndex: number;
    languageIndex: number;
}

export class PropName {
    name: string;
    lang: string;
}

export class PropInquery {
    inquery: string;
    lang: string;
}

export class objectInquiries {
    describtion: string;
    unCompleteInstance: string;
    exitInstance: string;
    objectCompleted: string;
    instanceNeedModification: string;
    valueMessage: string;
    lang: string;
    newInstance: string;
    modifyInstance: string;
}

export class BotObject {
    id: string;
    name: string;
    ontology: boolean;
    classId: string;
    dataType: string;
    properties: ObjectProp[];
}

export class ObjectProp {
    id: number;
    name: string;
    dataType: string;
}

export class restriction {
    predicateId: number;
    name?: string;
    valueId: number;
    value: string;
    vOperator: number;
}
