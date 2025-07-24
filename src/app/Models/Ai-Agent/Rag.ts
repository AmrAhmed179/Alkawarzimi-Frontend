 export interface FileImportChunk {
  fileID: string;
  filename: string;
  extension: string;
  status_report: object;
  source: string;
  isURL: boolean;
  metadata: string;
  overwrite: boolean;
  content: string;
  isLastChunk: boolean;
  total: number;
  order: number;
  credentials: {
    deployment: string;
    key: string;
    url: string;
    chatbotId: string;
    mode: string;
  };
  isLastDocument: boolean;
}

export interface FileImportRequest {
  chunk: string; // stringified FileImportChunk
}
export interface FileData {
  fileID: string;
  filename: string;
  extension: string;
  status_report: { [key: string]: any }; // Could be a more detailed type if you have one
  source: string;
  isURL: boolean;
  metadata: string;
  overwrite: boolean;
  content: string; // Base64 encoded file data
  labels: string[];
  rag_config: RAGConfig;
  file_size: number;
  status: string; // e.g., "READY", "WAITING", "DONE", "ERROR"
  block?: boolean; // (optional) - appears in WebSocket update
}
export type RAGConfig = {
  [componentTitle: string]: RAGComponentClass;
};

export type RAGComponentClass = {
  selected: string;
  components: RAGComponent;
};

export type RAGComponent = {
  [key: string]: RAGComponentConfig;
};

export type RAGComponentConfig = {
  name: string;
  variables: string[];
  library: string[];
  description: string[];
  selected: string;
  config: RAGSetting;
  type: string;
  available: boolean;
};

export type RAGSetting = {
  [key: string]: ConfigSetting;
};

export type ConfigSetting = {
  type: string;
  value: string | number | boolean;
  description: string;
  values: string[];
};
