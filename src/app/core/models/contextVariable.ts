export interface ContextVariableModel {
    contextVariableId: string;
    key: string;
    intentId: string;
    name: string;
    value: string;
    type: string;
    dataType: string;
    validationSubType: string;
    list: boolean;
    sysVariable: boolean;
    sourceBot: string;
    servicesId: string;
    sysVariabletype: number;
    displayFields: string[];
    show?:string;
    validationSubTypeN?:number
}

export interface DataTypes {
    type:string;
    dataType:string;
    id:string
}