interface Entity {
    entityId: string;
    entity: string;
    values: Value[];
  
  }
  
  interface Value {
    type: string | null;
    value: string;
    language: string;
    synonymsInfo: Synonym[];
    metadata: any;
  }
  
  interface Synonym {
    value: string;
  }