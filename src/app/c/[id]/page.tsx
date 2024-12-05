import Messages from "@/features/chat-interface/components/messages";
import dynamic from "next/dynamic";
import { getChat } from "@/features/chat-interface/utils/service-chat";

const TextInput = dynamic(
  () => import("@/features/chat-interface/components/text-input"),
  { ssr: false }
);

type ChatParams = {
  params: { id: string };
};

export default async function ChatInterface({ params }: ChatParams) {
  const chat = await getChat(params.id);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 relative">
        <div className="absolute inset-0 overflow-y-auto">
          <div className="py-5 sm:py-10 lg:py-14">
            <Messages data={chat} />
          </div>
        </div>
      </main>
      <footer className="flex-none w-full min-w-80 max-w-4xl mx-auto relative">
        <TextInput chatId={params.id} />
      </footer>
    </div>
  );
}
