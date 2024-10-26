import { ThumbsDown, ThumbsUp, Clipboard, RotateCcw } from "lucide-react";

const ActionsButtons = ({ newAnswer }: { newAnswer: boolean }) => {
  return (
    <div className="sm:flex sm:justify-between">
      <div>
        <div className="inline-flex border border-gray-200 rounded-full p-0.5 dark:border-neutral-700">
          <button
            type="button"
            className="inline-flex shrink-0 justify-center items-center size-8 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-none focus:bg-blue-100 focus:text-blue-800 dark:text-neutral-500 dark:hover:bg-blue-900 dark:hover:text-blue-200 dark:focus:bg-blue-900 dark:focus:text-blue-200"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="inline-flex shrink-0 justify-center items-center size-8 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-none focus:bg-red-100 focus:text-red-800 dark:text-neutral-500 dark:hover:bg-red-900 dark:hover:text-red-200 dark:focus:bg-red-900 dark:focus:text-red-200"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>
        <button
          type="button"
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          <Clipboard className="w-4 h-4" />
        </button>
      </div>

      {newAnswer && (
        <div className="mt-1 sm:mt-0">
          <button
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
          >
            <RotateCcw className="w-4 h-4" />
            New answer
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionsButtons;
