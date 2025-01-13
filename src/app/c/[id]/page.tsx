import Messages from "@/features/chat-interface/components/messages";

export default function ChatInterface() {

  return (
    <main className="flex-1 relative">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="py-5 sm:py-10 lg:py-14">
          <Messages />
        </div>
      </div>
    </main>
  );
}
