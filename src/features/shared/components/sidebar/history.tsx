"use client";
import { usePathname } from "next/navigation";
import useChat from "@/features/chat-interface/hooks/useChat";
import { LoadingState } from "../sidebar/loading-state";
import { ChatsError } from "../history/chats-error";
import { ChatGroup } from "./chat-group";

const History = () => {
  const pathname = usePathname();
  const { chatsQuery, deleteChat } = useChat();
  const { isPending, isError, data, error } = chatsQuery;

  if (isPending) return <LoadingState />;
  if (isError) return <ChatsError error={error} />;

  return (
    <>
      {Object.keys(data).map((key) => (
        <ChatGroup
          key={key}
          groupKey={key}
          chats={data[key]}
          currentPath={pathname}
          onDeleteChat={(id) => deleteChat.mutate({ id })}
        />
      ))}
    </>
  );
};

export default History;
