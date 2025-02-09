"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { usePreference } from "@/features/shared/providers/preference-provider";
import {
  chatting,
  initializeChat,
  removeChatById,
} from "@/features/chat-interface/utils/service-chat";
import { MarkdownItem } from "../components/text-input/text-input";
import { chatKeys, Conversations, Message } from "../utils/chat-queries";

type c = { message: MarkdownItem[]; chatId_?: string };

function useChat() {
  const pathname = usePathname();
  const router = useRouter();
  const chatId = pathname.split("/").pop() as string;
  const currentModel = usePreference((state) => state.currentModel);

  const queryClient = useQueryClient();

  const chatQuery = useSuspenseQuery(Message(chatId));
  const chatsQuery = useSuspenseQuery(Conversations());

  const createChat = useMutation({
    mutationKey: chatKeys.list(),
    mutationFn: ({ message }: c) => initializeChat(message, currentModel),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: chatKeys.list() });
      const previousData: any = queryClient.getQueryData(chatKeys.list());

      if (previousData)
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
    mutationFn: ({ message, chatId_ }: c) => {
      if (!chatId && !chatId_) {
        router.push("/");
        throw new Error("Required chatId");
      }

      const realChatId = (chatId || chatId_) as string;

      return chatting(message, realChatId, currentModel);
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: chatKeys.detail(chatId) });
      const previousData: any = queryClient.getQueryData(
        chatKeys.detail(chatId)
      );

      if (previousData) {
        queryClient.setQueryData(chatKeys.detail(chatId), {
          ...previousData,
          history: previousData.history.concat({
            role: "user",
            content: data.message,
          }),
        });

        return { previousData };
      }
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
