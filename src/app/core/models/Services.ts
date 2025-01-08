export interface ServicesModel {
    servicesId: number;
    name: string;
    url: string;
    userName: string;
    password: string;
    login: boolean;
    mainApi: boolean;
    dynamicMenuLoader: boolean;
    liveChatService: boolean;
    serviceData: ServiceData[];
    executionConfimation: boolean;
    messages: ServiceMessage[];
    outputMapping: OutputMapping[];
}

export interface ServiceData {
    ObjectID: string;
    Required: boolean;
    Knowledege: boolean;
    dispaly: boolean;
    resetAfterUsage: boolean;
    password: string;
    object?:string;
    index?:number
}

export interface OutputMapping {
    variableId: string;
    jsonField: string;
    variable?:string;
}

export interface ServiceMessage {
    confirmation: string;
    refuseMessage: string;
    uncompletedObjects: string;
    language: string;
}