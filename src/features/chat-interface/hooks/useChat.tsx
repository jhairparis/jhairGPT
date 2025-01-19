"use client";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePreference } from "@/features/shared/providers/preference-provider";
import {
  chatting,
  getChat,
  getChats,
  initializeChat,
  removeChatById,
} from "../utils/service-chat";

type c = { message: string };

export const chatKeys = {
  all: () => ["chats"],
  list: () => [...chatKeys.all(), "list"],
  detail: (id: string) => [...chatKeys.all(), id],
};

function useChat() {
  const pathname = usePathname();
  const router = useRouter();
  const chatId = pathname.split("/").pop() as string;
  const currentModel = usePreference((state) => state.currentModel);

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

  const createChat = useMutation({
    mutationKey: chatKeys.list(),
    mutationFn: ({ message }: c) => initializeChat(message, currentModel),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: chatKeys.list() });
      const previousData: any = queryClient.getQueryData(chatKeys.list());

      queryClient.setQueryData(chatKeys.list(), () => {
        return {
          ...previousData,
          today: previousData["today"].concat({
            id: "temp",
            title: "New Chat",
          }),
        };
      });

      return { previousData };
    },
    onSuccess: (data) => {
      router.push(`/c/${data.chatId}`);
    },
    onError: (e) => {
      console.log(e, "hey");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.list() });
    },
  });

  const updateChat = useMutation({
    mutationKey: chatKeys.detail(chatId),
    mutationFn: ({ message }: c) => {
      if (!chatId) {
        router.push("/");
        throw new Error("Required chatId");
      }
      return chatting(message, chatId, currentModel);
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

  const deleteChat = useMutation({
    mutationKey: chatKeys.list(),
    mutationFn: ({ id }: { id: string; groupKey: string }) =>
      removeChatById(id),
    onMutate: async ({ groupKey, id }) => {
      await queryClient.cancelQueries({ queryKey: chatKeys.list() });
      const previousData: any = queryClient.getQueryData(chatKeys.list());

      queryClient.setQueryData(chatKeys.list(), () => {
        return {
          ...previousData,
          [groupKey]: previousData[groupKey].filter(
            (chat: any) => chat.id !== id
          ),
        };
      });

      return { previousData };
    },
    onError: (e) => {
      console.log(e, "hey");
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.list() });
      queryClient.invalidateQueries({ queryKey: chatKeys.detail(id) });
      if (pathname === `/c/${id}`) router.push("/");
    },
  });

  return {
    chatQuery,
    chatsQuery,
    createChat,
    updateChat,
    deleteChat,
  };
}

export default useChat;
