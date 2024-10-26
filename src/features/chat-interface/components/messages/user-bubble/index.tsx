import { Play, User } from "lucide-react";
import { process } from "@/features/chat-interface/utils/general";

type BubbleProps = {
  content: string;
};
const BubbleUser = ({ content }: BubbleProps) => {
  const processedContent = process(content);

  return (
    <li className="max-w-2xl ms-auto flex justify-end gap-x-2 sm:gap-x-4">
      <div className="grow text-end space-y-3">
        <div className="inline-block bg-blue-600 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-white">{processedContent}</p>
          <div className="mt-3">
            <button
              type="button"
              className="p-2 inline-flex justify-center items-center gap-x-1 rounded-lg bg-white/10 border border-transparent font-medium text-gray-100 hover:text-gray-600 hover:bg-white focus:outline-none focus:ring-2 ring-offset-blue-600 focus:ring-white focus:ring-offset-2 text-xs"
            >
              <Play className="w-4 h-4" />
              Voice message
            </button>
          </div>
        </div>
      </div>

      <span className="shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-gray-600">
        <User />
      </span>
    </li>
  );
};

export default BubbleUser;
