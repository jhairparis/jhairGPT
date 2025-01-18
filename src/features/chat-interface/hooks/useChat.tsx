"use client";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  chatting,
  getChat,
  getChats,
  initializeChat,
} from "../utils/service-chat";

type c = { message: string; model: string };

export const chatKeys = {
  all: () => ["chats"],
  list: () => [...chatKeys.all(), "list"],
  detail: (id: string) => [...chatKeys.all(), id],
};

function useChat() {
  const pathname = usePathname();
  const router = useRouter();
  const chatId = pathname.split("/").pop() as string;

  const queryClient = useQueryClient();

  const chatQuery = useQuery({
    queryKey: chatKeys.detail(chatId),
    queryFn: () => getChat(chatId),
    enabled: Boolean(chatId),
  });

  const chatsQuery = useQuery({
    queryKey: chatKeys.list(),
    queryFn: getChats,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message === "Error 401: Unauthorized")
        return false;

      return failureCount < 3;
    },
  });

  const updateChat = useMutation({
    mutationKey: chatKeys.detail(chatId),
    mutationFn: ({ message, model }: c) => {
      if (!chatId) {
        router.push("/");
        throw new Error("Required chatId");
      }
      return chatting(message, chatId, model);
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: chatKeys.detail(chatId) });
      const previousData: any = queryClient.getQueryData(
        chatKeys.detail(chatId)
      );

      queryClient.setQueryData(chatKeys.detail(chatId), {
        ...previousData,
        history: previousData.history.concat({
          role: "user",
          content: [{ type: "text", text: data.message }],
        }),
      });

      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(chatKeys.detail(chatId), context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.detail(chatId) });
    },
  });

  const createChat = useMutation({
    mutationKey: chatKeys.list(),
    mutationFn: ({ message, model }: c) => initializeChat(message, model),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: chatKeys.list() });
      const previousData: any = queryClient.getQueryData(chatKeys.list());

      queryClient.setQueryData(chatKeys.list(), () => {
        return [...previousData, { id: "temp", title: "New Chat" }];
      });

      return { previousData };
    },
    onSuccess: (data) => {
      router.push(`/c/${data.chatId}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.list() });
    },
  });

  return {
    chatQuery,
    chatsQuery,
    createChat,
    updateChat,
  };
}

export default useChat;
