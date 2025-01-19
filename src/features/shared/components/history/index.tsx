"use client";
import useChat from "@/features/chat-interface/hooks/useChat";
import { ChatsLoading } from "./chats-loading";
import { ChatsError } from "./chats-error";
import { ChatsGroup } from "./chats-group";

const History = () => {
  const { chatsQuery } = useChat();
  const { isPending, isError, data, error } = chatsQuery;

  if (isPending) return <ChatsLoading />;
  if (isError) return <ChatsError error={error} />;

  return (
    <>
      {Object.keys(data).map((key) => (
        <ChatsGroup
          key={key}
          groupKey={key}
          chats={data[key]}
        />
      ))}
    </>
  );
};

export default History;
