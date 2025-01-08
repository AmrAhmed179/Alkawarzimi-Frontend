interface Inquiry {
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

interface Name {
    name: string;
    lang: string;
}

interface PropertyInquiry {
    inquery: string;
    lang: string;
}

interface Property {
    propId: number;
    key: string;
    names: Name[];
    inquiries: PropertyInquiry[];
    selection_policy: string;
    dataTypeId: string;
    required: boolean;
    reset: boolean;
    list: boolean;
    dummy: boolean;
    listValues: boolean;
    ask: boolean;
    caseProp: boolean;
    restrictions: any[];
}

interface FormData {
    classId: number;
    name: string;
    caseClass: boolean;
    arbClassName: string;
    inquiries: Inquiry[];
    properties: Property[];
}
