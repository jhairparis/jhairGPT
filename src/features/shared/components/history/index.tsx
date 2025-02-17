"use client";
import { ChatsLoading } from "./chats-loading";
import { ChatsError } from "./chats-error";
import { ChatsGroup } from "./chats-group";
import useChatUtils from "../../hooks/useChatUtils";

const History = () => {
  const { chatsQuery } = useChatUtils();
  const { isPending, isError, data, error } = chatsQuery;

  if (isPending) return <ChatsLoading />;
  if (isError) return <ChatsError error={error} />;

  return (
    <>
      {Object.keys(data).map((key) => (
        <ChatsGroup key={key} groupKey={key} chats={data[key]} />
      ))}
    </>
  );
};

export default History;
