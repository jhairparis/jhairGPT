"use client";
import { useEffect } from "react";
import AssistantBubble from "./assistant-bubble";
import ActionsButtons from "./assistant-bubble/ActionsButtons";
import UserBubble from "./user-bubble";
import { useChatContext } from "../../providers/chat";

const Messages = ({ data }: any) => {
  const { setChat, chat } = useChatContext();

  useEffect(() => {
    setChat({
      ...chat,
      currentChat: data,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
      <ul className="mt-5 text-white">
        {chat.currentChat.history?.map(({ role, content }: any, index: number) =>
          role === "user" ? (
            <UserBubble key={index + role} content={content} />
          ) : (
            <AssistantBubble key={index + role} content={content}>
              <ActionsButtons newAnswer={index === chat.currentChat.history!.length - 1} />
            </AssistantBubble>
          )
        )}
      </ul>
    </div>
  );
};

export default Messages;
