export interface ChatContent {
  type: string;
  text: string;
}

export interface ChatHistoryItem {
  role: string;
  content: ChatContent[];
}

export interface ChatResult {
  history: ChatHistoryItem[];
}

export interface ApiRespond<T> {
  result: T;
  message: string;
}

export interface ChatHistory extends ApiRespond<ChatResult> {}
