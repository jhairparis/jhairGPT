"use client";
import { BotMessageSquare } from "lucide-react";
import { process } from "@/features/chat-interface/utils/general";
import RenderMarkdown from "../render";

type BubbleProps = {
  content:  {
    type: string;
    text: string;
  }[];
  children: React.ReactNode;
};

const BubbleAssistant = ({ content, children }: BubbleProps) => {
  const processedContent = process(content);

  return (
    <li className="flex flex-row gap-x-2 sm:gap-x-4 my-8 w-full">
      <span className="shrink-0 hidden sm:inline-flex items-center justify-center size-[38px] rounded-full bg-amber-200 dark:bg-amber-700 ">
        <BotMessageSquare className="w-6 h-6 text-amber-700 dark:text-amber-200" />
      </span>

      <div className="max-w-full overflow-hidden">
        <RenderMarkdown content={processedContent} />
        <div>{children}</div>
      </div>
    </li>
  );
};

export default BubbleAssistant;
