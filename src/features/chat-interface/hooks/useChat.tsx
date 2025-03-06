"use client";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePreference } from "@/features/shared/providers/preference-provider";
import {
  chatting,
  initializeChat,
  removeChatById,
} from "@/features/chat-interface/utils/service-chat";
import { MarkdownItem } from "../components/text-input/text-input";
import { chatKeys } from "../utils/chat-queries";
import { getQueryClientDynamic } from "@/features/shared/lib/queryClientDynamic";
import { toast } from "sonner";

type c = { message: MarkdownItem[]; chatId_?: string };

function useChat() {
  const pathname = usePathname();
  const router = useRouter();
  const chatId = pathname.split("/").pop() as string;
  const currentModel = usePreference((state) => state.currentModel);

  const queryClient = useQueryClient();
  const queryClientDynamic = getQueryClientDynamic();

  const createChat = useMutation({
    mutationKey: chatKeys.list(),
    mutationFn: ({ message }: c) => initializeChat(message, currentModel),
    onMutate: async () => {
      await queryClientDynamic.cancelQueries({ queryKey: chatKeys.list() });
      const previousData: any = queryClientDynamic.getQueryData(
        chatKeys.list()
      );

      if (previousData && Object.keys(previousData).length > 0)
        queryClientDynamic.setQueryData(chatKeys.list(), () => {
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
      toast.success("Chat created successfully");
      router.push(`/c/${data.chatId}`);
    },
    onError: (e) => {
      toast.error("Failed to start new chat");
    },
    onSettled: () => {
      queryClientDynamic.invalidateQueries({ queryKey: chatKeys.list() });
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
      toast.error("Failed to send message");
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
      await queryClientDynamic.cancelQueries({ queryKey: chatKeys.list() });
      const previousData: any = queryClientDynamic.getQueryData(
        chatKeys.list()
      );

      queryClientDynamic.setQueryData(chatKeys.list(), () => {
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
      toast.error("Failed to delete chat");
    },
    onSuccess: (_, { id }) => {
      toast.success("Chat deleted successfully");
      queryClientDynamic.invalidateQueries({ queryKey: chatKeys.list() });
      queryClient.invalidateQueries({ queryKey: chatKeys.detail(id) });
      if (pathname === `/c/${id}`) router.push("/");
    },
  });

  return {
    createChat,
    updateChat,
    deleteChat,
  };
}

export default useChat;
