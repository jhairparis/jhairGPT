"use client";
import { ChatsLoading } from "./chats-loading";
import { ChatsError } from "./chats-error";
import { ChatsGroup } from "./chats-group";
import { useSuspenseQuery } from "@tanstack/react-query";
import { chatKeys } from "@/features/chat-interface/utils/chat-queries";
import { getChats } from "@/features/chat-interface/utils/service-chat";

const History = () => {
  const { isPending, isError, data, error } = useSuspenseQuery({
    queryKey: chatKeys.list(),
    queryFn: getChats,
    staleTime: 60 * 1000,
  });

  if (isPending) return <ChatsLoading />;

  if (isError || Object.keys(data).length === 0) {
    return (
      <ChatsError
        error={
          error || (typeof data === "number" || data === null ? data : null)
        }
      />
    );
  }

  const keys = Object.keys(data);

  return (
    <>
      {keys.map((key) => (
        <ChatsGroup
          key={key as string}
          groupKey={key as string}
          chats={(data as any)[key as any] as any}
        />
      ))}
    </>
  );
};

export default History;
