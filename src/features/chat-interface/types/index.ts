export interface ChatContent {
  type: string;
  text: string;
}

export interface ChatHistoryItem {
  role: string;
  content: ChatContent[];
}

export interface ChatQuestion {
  q1: string;
  q2: string;
  q3: string;
}

export interface ChatHistoryInfo {
  answer: {
    finishReason: {
      message: string | null;
      reason: string;
    };
  };
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface ChatResult {
  title: string;
  history: ChatHistoryItem[];
  chatQuestion: ChatQuestion[];
  historyInfo: any[];
}

export interface Chat extends ChatResult {
  id: string;
  createdAt: string;
  updatedAt: string;
  public: boolean;
  owner: string;
}

export type OrderChat = {
  today: Chat[];
  lastSevenDays: Chat[];
  lastMonth: Chat[];
  threeMonthsAgo: Chat[];
  lastYear: Chat[];
  olderItems: Chat[];
  error?: string;
};

export interface ApiRespond<T> {
  result: T;
  message: string;
}

export interface ChatHistory extends ApiRespond<ChatResult> {}

export interface ChatList extends ApiRespond<OrderChat> {}
