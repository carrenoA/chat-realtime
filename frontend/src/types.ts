export interface FileData {
  type: string;
  url: string;
}

export interface Message {
  from: string;
  to?: string;
  message: string;
  timestamp?: number;
  files?: FileData[];
  audioUrl?: string;
}
