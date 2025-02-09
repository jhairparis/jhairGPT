import Messages from "@/features/chat-interface/components/messages";
import { Message } from "@/features/chat-interface/utils/chat-queries";
import { CSRF_COOKIE, AUTH_COOKIE } from "@/features/shared/constants/cookies";
import { getQueryClient } from "@/features/shared/lib/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";

type props = { id: string };

export default async function ChatInterface(params: props) {
  const cookieStore = cookies();
  const chatId = params.id;
  const queryClient = getQueryClient();

  const authCookies = [
    cookieStore.get(CSRF_COOKIE),
    cookieStore.get(AUTH_COOKIE),
  ];

  await queryClient.prefetchQuery(Message(chatId, authCookies));

  return (
    <main className="flex-1 relative">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="py-5 sm:py-10 lg:py-14">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Messages />
          </HydrationBoundary>
        </div>
      </div>
    </main>
  );
}
