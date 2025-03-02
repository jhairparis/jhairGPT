"use client";
import AssistantBubble from "./assistant-bubble";
import ActionsButtons from "./assistant-bubble/ActionsButtons";
import UserBubble from "./user-bubble";
import { AiOutlineLoading } from "react-icons/ai";
import { notFound } from "next/navigation";
import useChatUtils from "@/features/shared/hooks/useChatUtils";

const Messages = () => {
  const { chatQuery } = useChatUtils();
  const { isPending, isError, data } = chatQuery;

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-20">
        <AiOutlineLoading className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return notFound();
  }

  return (
    <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
      <ul className="mt-5">
        {"history" in data &&
          data.history?.map(({ role, content }, index) =>
            role === "user" ? (
              <UserBubble key={index + role} content={content} />
            ) : (
              <AssistantBubble key={index + role} content={content}>
                <ActionsButtons
                  newAnswer={index === data.history!.length - 1}
                />
              </AssistantBubble>
            )
          )}
      </ul>
    </div>
  );
};

export default Messages;
