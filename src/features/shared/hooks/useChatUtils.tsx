"use client";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Conversations,
  Message,
} from "../../chat-interface/utils/chat-queries";

function useChatUtils() {
  const pathname = usePathname();
  const chatId = pathname.split("/").pop() as string;

  const chatQuery = useQuery(Message(chatId));
  const chatsQuery = useQuery(Conversations);

  return {
    chatQuery,
    chatsQuery,
  };
}

export default useChatUtils;
