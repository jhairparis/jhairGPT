import * as z from "zod";

const ChatContent = z.object({
  type: z.string(),
  text: z.string(),
});

const ChatHistoryItem = z.object({
  role: z.string(),
  content: z.array(ChatContent),
});

const ChatQuestion = z.object({
  q1: z.string(),
  q2: z.string(),
  q3: z.string(),
  selected: z.number().nullable(),
  title: z.string().optional(),
});

const ChatHistoryInfo = z.object({
  answer: z.object({
    finishReason: z.object({
      message: z.string().nullable(),
      reason: z.string(),
    }),
  }),
  usage: z.object({
    completion_tokens: z.number(),
    prompt_tokens: z.number(),
    total_tokens: z.number(),
  }),
});

const Chat = z.object({
  id: z.string(),
  title: z.string(),
  owner: z.string(),
  public: z.boolean(),
  history: z.array(ChatHistoryItem),
  chatQuestions: z.array(ChatQuestion),
  historyInfo: z.array(ChatHistoryInfo),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const ChatHistory = Chat.pick({
  title: true,
  history: true,
  chatQuestions: true,
  historyInfo: true,
});

const ChatList = Chat.pick({
  id: true,
  title: true,
  owner: true,
  public: true,
  createdAt: true,
  updatedAt: true,
});

const OrderChat = z.object({
  today: z.array(ChatList),
  lastSevenDays: z.array(ChatList),
  lastMonth: z.array(ChatList),
  threeMonthsAgo: z.array(ChatList),
  lastYear: z.array(ChatList),
  olderItems: z.array(ChatList),
});

export type ChatListType = z.infer<typeof ChatList>;

export {
  ChatContent,
  ChatHistory,
  ChatHistoryItem,
  ChatHistoryInfo,
  ChatQuestion,
  Chat,
  OrderChat,
};
