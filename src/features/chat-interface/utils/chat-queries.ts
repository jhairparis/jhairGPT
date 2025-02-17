import { queryOptions } from "@tanstack/react-query";
import {
  getChat,
  getChats,
  getChatServer,
  getChatsServer,
} from "./service-chat";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ApiError } from "@/features/shared/lib/ApiError";

export const chatKeys = {
  all: () => ["chats"],
  list: () => [...chatKeys.all(), "list"],
  detail: (id: string) => [...chatKeys.all(), id],
};

const retry = (failureCount: number, error: Error) => {
  if (error instanceof ApiError && error.status === 401) return false;
  return failureCount < 3;
};

export const MessageServer = (id: string, cookies: RequestCookie[] | null) =>
  queryOptions({
    queryKey: chatKeys.detail(id),
    queryFn: () => getChatServer(id, cookies),
    retry,
  });

export const Message = (id: string) =>
  queryOptions({
    queryKey: chatKeys.detail(id),
    queryFn: () => getChat(id),
    enabled: !!id,
    retry,
  });

export const ConversationsServer = (cookies?: RequestCookie[] | null) =>
  queryOptions({
    queryKey: chatKeys.list(),
    queryFn: () => getChatsServer(cookies),
    retry,
  });

export const Conversations = queryOptions({
  queryKey: chatKeys.list(),
  queryFn: () => getChats(),
  retry,
});
