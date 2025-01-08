export interface PreDefinedEntity {
    _id: number;
    name: string;
    description: string;
    examples: string[];
    parent: number;
    status?:boolean;
}