"use client";
import { ChatsLoading } from "./chats-loading";
import { ChatsError } from "./chats-error";
import { ChatsGroup } from "./chats-group";
import { useSuspenseQuery } from "@tanstack/react-query";
import { chatKeys } from "@/features/chat-interface/utils/chat-queries";
import { getChats } from "@/features/chat-interface/utils/service-chat";
import { FetchApiError } from "../../lib/fetchApi";
import { OrderChat } from "@/features/chat-interface/types";

const History = () => {
  const { isPending, isError, data, error } = useSuspenseQuery({
    queryKey: chatKeys.list(),
    queryFn: () => getChats(),
    staleTime: 60 * 1000,
  });

  if (isPending) return <ChatsLoading />;

  if (isError && error)
    return <ChatsError error={error as unknown as FetchApiError} />;

  if (data.error) return <ChatsError error={JSON.parse(data.error)} />;

  const keys = Object.keys(data) as (keyof Omit<OrderChat, "error">)[];

  return (
    <>
      {keys.map((key) => (
        <ChatsGroup
          key={key as string}
          groupKey={key as string}
          chats={data[key]}
        />
      ))}
    </>
  );
};

export default History;
