import { BotMessageSquare } from "lucide-react";
import { process } from "@/features/chat-interface/utils/general";
import dynamic from "next/dynamic";
import ActionsButtons from "./ActionsButtons";

const RenderMarkdown = dynamic(() => import("../render"), { ssr: false });

type BubbleProps = {
  content: string;
  children: React.ReactNode;
};

const BubbleAssistant = ({ content, children }: BubbleProps) => {
  const processedContent = process(content);

  return (
    <li className="flex gap-x-2 sm:gap-x-4 my-8 ">
      <span className="shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-amber-200 dark:bg-amber-700 ">
        <BotMessageSquare className="w-6 h-6 text-amber-700 dark:text-amber-200" />
      </span>

      <div className="grow max-w-[90%] md:max-w-2xl w-full space-y-3">
        <div className="bg-white border border-gray-200 rounded-lg  dark:bg-neutral-900 dark:border-neutral-700">
          <RenderMarkdown content={processedContent} />
        </div>

        <div>{children}</div>
      </div>
    </li>
  );
};

export default BubbleAssistant;
