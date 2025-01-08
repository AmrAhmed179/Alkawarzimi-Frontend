export interface SystemEntity {
    entityId: string;
    entity: string;
    sysEntity: boolean;
    description: string;
    values: EntityValues[];
    sourceBot: string;
}

export interface EntityValues {
    type: string;
    value: string;
    language: string;
    synonymsInfo: SynonymInfo[];
    metadata: string;
}

export interface SynonymInfo {
    value: string;
    language: string;
}