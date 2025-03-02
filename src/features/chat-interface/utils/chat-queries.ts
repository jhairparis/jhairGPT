import { queryOptions } from "@tanstack/react-query";
import {
  getChat,
  getChats,
  getChatServer,
  getChatsServer,
} from "./service-chat";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const chatKeys = {
  all: () => ["chats"],
  list: () => [...chatKeys.all(), "list"],
  detail: (id: string) => [...chatKeys.all(), id],
};

export const MessageServer = (id: string, cookies: RequestCookie[] | null) =>
  queryOptions({
    queryKey: chatKeys.detail(id),
    queryFn: () => getChatServer(id, cookies),
  });

export const Message = (id: string) =>
  queryOptions({
    queryKey: chatKeys.detail(id),
    queryFn: () => getChat(id),
    enabled: !!id,
  });
