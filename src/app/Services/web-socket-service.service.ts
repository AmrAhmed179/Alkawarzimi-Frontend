// web-socket.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface FileUploadChunk {
  chunk: string; // Stringified FileChunkData
  isLastChunk: boolean;
  total: number;
  order: number;
  fileID: string;
  credentials: {
    deployment: string;
    key: string;
    url: string;
    chatbotId: string;
    mode: string;
  };
  isLastDocument: boolean;
}

export interface FileChunkData {
  fileID: string;
  filename: string;
  extension: string;
  status_report: Record<string, any>;
  source: string;
  isURL: boolean;
  metadata: string;
  overwrite: boolean;
  content: string; // Base64 encoded content
  labels?: string[];
  rag_config?: RAGConfig;
  file_size?: number;
  status?: string;
}

export interface RAGConfig {
  [key: string]: {
    selected: string;
    components: {
      [key: string]: {
        name: string;
        variables: string[];
        library: string[];
        description: string;
        type: string;
        config: Record<string, any>;
        available: boolean;
      };
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  private messageSubject = new Subject<any>();
  private readonly CHUNK_SIZE = 20000; // 30KB chunks

  constructor() { }

  // Connection Management
  connect(url: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.messageSubject.next(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.messageSubject.error(error);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      this.messageSubject.complete();
    };
  }

  // Message Handling
  onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  // File Upload Methods
  async uploadFile(
  file: any,
  credentials: {
    deployment: string;
    key: string;
    url: string;
    chatbotId: string;
    mode: string;
  },
  isLastDocument: boolean
): Promise<void> {
  if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
    throw new Error('WebSocket is not connected');
  }

  const fileId = file.name;

  // Step 1: Read entire file as base64
  const fileContent = await this.readEntireFileAsBase64(file);

  // Step 2: Construct full chunkData object
  const fullChunkData: FileChunkData = {
    fileID: fileId,
    filename: file.name,
    extension: file.name.split('.').pop() || '',
    status_report: {},
    source: '',
    isURL: false,
    metadata: '',
    overwrite: false,
    content: fileContent,
    labels: ['Document'],
    rag_config: file.rag_config ,//this.getDefaultRAGConfig(),
    file_size: file.size,
    status: 'READY'
  };

  // Step 3: Convert chunkData to a single string
  const fullString = JSON.stringify(fullChunkData);

  // Step 4: Split the string into CHUNK_SIZE-sized pieces
  const totalChunks = Math.ceil(fullString.length / this.CHUNK_SIZE);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * this.CHUNK_SIZE;
    const end = Math.min(start + this.CHUNK_SIZE, fullString.length);
    const partialChunk = fullString.substring(start, end);

    const uploadChunk: FileUploadChunk = {
      chunk: partialChunk,
      isLastChunk: i === totalChunks - 1,
      total: totalChunks,
      order: i,
      fileID: fileId,
      credentials,
      isLastDocument: false //isLastDocument && i === totalChunks - 1
    };

    this.send(uploadChunk);
  }
}


private readEntireFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const base64 = this.arrayBufferToBase64(arrayBuffer);
      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file as base64.'));
    };

    reader.readAsArrayBuffer(file);
  });
}
  private readFileChunk(file: File, chunkIndex: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const start = chunkIndex * this.CHUNK_SIZE;
      const end = Math.min(start + this.CHUNK_SIZE, file.size);
      const blob = file.slice(start, end);

      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const base64 = this.arrayBufferToBase64(arrayBuffer);
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  // Utility Methods
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

   getDefaultRAGConfig(): RAGConfig {
    return {
      Reader: {
        selected: "Default",
        components: {
          Default: {
            name: "Default",
            variables: [],
            library: ["pypdf", "docx", "spacy"],
            description: "Ingests text, code, PDF, and DOCX files",
            type: "FILE",
            config: {},
            available: true
          }
        }
      },
    Chunker: {
      "components": {
        "Token": {
          "name": "Token",
          "variables": [],
          "library": [],
          "description": "Splits documents based on word tokens",
          "type": "",
          "config": {
            "Tokens": {
              "type": "number",
              "value": 250,
              "description": "Choose how many Token per chunks",
              "values": []
            },
            "Overlap": {
              "type": "number",
              "value": 50,
              "description": "Choose how many Tokens should overlap between chunks",
              "values": []
            }
          },
          "available": true
        },
        "Sentence": {
          "name": "Sentence",
          "variables": [],
          "library": [],
          "description": "Splits documents based on sentences",
          "type": "",
          "config": {
            "Sentences": {
              "type": "number",
              "value": 5,
              "description": "Choose how many Sentences per chunks",
              "values": []
            },
            "Overlap": {
              "type": "number",
              "value": 1,
              "description": "Choose how many Sentences should overlap between chunks",
              "values": []
            }
          },
          "available": true
        },
        "Recursive": {
          "name": "Recursive",
          "variables": [],
          "library": ["langchain_text_splitters"],
          "description": "Recursively split documents based on predefined characters using LangChain",
          "type": "",
          "config": {
            "Chunk Size": {
              "type": "number",
              "value": 500,
              "description": "Choose how many characters per chunks",
              "values": []
            },
            "Overlap": {
              "type": "number",
              "value": 100,
              "description": "Choose how many characters per chunks",
              "values": []
            },
            "Seperators": {
              "type": "multi",
              "value": "",
              "description": "Select seperators to split the text",
              "values": [
                "\n\n",
                "\n",
                " ",
                ".",
                ",",
                "​",
                "，",
                "、",
                "．",
                "。",
                ""
              ]
            }
          },
          "available": false
        },
        "Semantic": {
          "name": "Semantic",
          "variables": [],
          "library": ["sklearn"],
          "description": "Split documents based on semantic similarity or max sentences",
          "type": "",
          "config": {
            "Breakpoint Percentile Threshold": {
              "type": "number",
              "value": 80,
              "description": "Percentile Threshold to split and create a chunk, the lower the more chunks you get",
              "values": []
            },
            "Max Sentences Per Chunk": {
              "type": "number",
              "value": 20,
              "description": "Maximum number of sentences per chunk",
              "values": []
            }
          },
          "available": true
        },
        "HTML": {
          "name": "HTML",
          "variables": [],
          "library": ["langchain_text_splitters"],
          "description": "Split documents based on HTML tags using LangChain",
          "type": "",
          "config": {},
          "available": false
        },
        "Markdown": {
          "name": "Markdown",
          "variables": [],
          "library": ["langchain_text_splitters"],
          "description": "Split documents based on markdown formatting using LangChain",
          "type": "",
          "config": {},
          "available": true
        },
        "Code": {
          "name": "Code",
          "variables": [],
          "library": ["langchain_text_splitters"],
          "description": "Split code based on programming language using LangChain",
          "type": "",
          "config": {
            "Language": {
              "type": "dropdown",
              "value": "python",
              "description": "Select programming language",
              "values": [
                "cpp",
                "go",
                "java",
                "kotlin",
                "js",
                "ts",
                "php",
                "proto",
                "python",
                "rst",
                "ruby",
                "rust",
                "scala",
                "swift",
                "markdown",
                "latex",
                "html",
                "sol",
                "csharp",
                "cobol",
                "c",
                "lua",
                "perl",
                "haskell",
                "elixir"
              ]
            },
            "Chunk Size": {
              "type": "number",
              "value": 500,
              "description": "Choose how many characters per chunk",
              "values": []
            },
            "Chunk Overlap": {
              "type": "number",
              "value": 50,
              "description": "Choose how many characters overlap between chunks",
              "values": []
            }
          },
          "available": false
        },
        "JSON": {
          "name": "JSON",
          "variables": [],
          "library": ["langchain_text_splitters"],
          "description": "Split json files using LangChain",
          "type": "",
          "config": {
            "Chunk Size": {
              "type": "number",
              "value": 500,
              "description": "Choose how many characters per chunks",
              "values": []
            }
          },
          "available": false
        }
      },
      "selected": "Token"
    },

      Embedder: {
        selected: "Ollama",
        components: {
          Ollama: {
            name: "Ollama",
            variables: [],
            library: [],
            description: "Vectorizes documents and queries using Ollama.",
            type: "",
            config: {
              Model: {
                type: "dropdown",
                value: "Couldn't connect to Ollama http://host.docker.internal:11434",
                description: "Select a installed Ollama model",
                values: ["Couldn't connect to Ollama http://host.docker.internal:11434"]
              }
            },
            available: true
          }
        }
      }
    };
  }

  // Core WebSocket Methods
  send(data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
      throw new Error('WebSocket connection not established');
    }
  }

  close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  get connectionState(): number {
    return this.socket?.readyState || WebSocket.CLOSED;
  }

  get isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}
