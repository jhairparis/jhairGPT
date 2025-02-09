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

export const Message = (
  id: string,
  cookies?: Array<RequestCookie | undefined>
) => {
  // Server side
  if (cookies && id !== "") {
    return queryOptions({
      queryKey: chatKeys.detail(id),
      queryFn: () => getChatServer(id, cookies),
    });
  }

  // Client side
  if (id === "") {
    return queryOptions({
      queryKey: chatKeys.detail("no-id"),
      queryFn: () =>
        Promise.resolve({
          history: [
            {
              role: "user",
              content: [{ type: "text", text: "Show me the weather" }],
            },
          ],
        }),
      enabled: false,
    });
  }

  return queryOptions({
    queryKey: chatKeys.detail(id),
    queryFn: () => getChat(id),
    enabled: true,
  });
};

export const Conversations = (cookies?: any) =>
  queryOptions({
    queryKey: chatKeys.list(),
    queryFn: () => {
      if (cookies) return getChatsServer(cookies);

      return getChats();
    },
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message === "Error 401: Unauthorized")
        return false;
      return failureCount < 3;
    },
  });
