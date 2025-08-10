export interface FileData {
  type: string;
  url: string;
}

export interface Message {
  id: unknown;
  from: string; 
  to?: string;
  message: string;
  timestamp?: string; 
  files?: FileData[];
  audioUrl?: string;
}

export function normalizeMessage(msg: Partial<Message>): Message {
  return {
    id: msg.id ?? crypto.randomUUID(),
    from: msg.from ?? 'Anon',
    to: msg.to ?? '',
    message: msg.message ?? '',
    timestamp: typeof msg.timestamp === 'string'
      ? msg.timestamp
      : msg.timestamp
        ? new Date(msg.timestamp).toISOString()
        : new Date().toISOString(),
    files: msg.files ?? [],
    audioUrl: msg.audioUrl ?? '',
  };
}