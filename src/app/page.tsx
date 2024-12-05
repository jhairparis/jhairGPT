'use client'
import dynamic from "next/dynamic";

const appName = "XX";

const TextInput = dynamic(
  () => import("@/features/chat-interface/components/text-input"),
  { ssr: false }
);

const Page = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-grow flex flex-col justify-center">
        <div className="flex flex-col justify-center items-center max-w-4xl w-full text-center mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white m-0 max-w-fit overflow-hidden whitespace-nowrap animation">
            Welcome to{` ${appName}`}
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Your copilot for all
          </p>
        </div>
      </main>
      <footer className="flex-none w-full min-w-80 max-w-4xl mx-auto relative">
        <TextInput />
      </footer>
    </div>
  );
};

export default Page;
