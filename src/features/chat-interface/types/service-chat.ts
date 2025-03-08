import { z } from "zod";
import { RespondSchema } from "./backend";
import {
  ChatContent,
  ChatHistory,
  ChatQuestion,
  OrderChat,
} from "./chat-document";

const ChatHistoryApi = RespondSchema.extend({
  result: ChatHistory,
});

const ChatListApi = RespondSchema.extend({
  result: OrderChat,
});

const FastAiResponse = z.object({
  answer: ChatContent,
  questions: ChatQuestion.pick({ q1: true, q2: true, q3: true }),
});

const InitChatApi = RespondSchema.extend({
  result: FastAiResponse,
  chatId: z.string(),
});

const UpdateChatApi = RespondSchema.extend({
  result: FastAiResponse,
});

export { ChatHistoryApi, ChatListApi, InitChatApi, UpdateChatApi };
