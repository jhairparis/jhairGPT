import { getAuth } from "@/features/auth/utils/auth";
import Client from "@/features/chat-interface/components/Client";
import Messages from "@/features/chat-interface/components/messages";
import { Message } from "@/features/chat-interface/utils/chat-queries";
import { getQueryClient } from "@/features/shared/lib/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";

type props = { params: { id: string } };

export default async function ChatInterface(params: props) {
  const cookieStore = cookies();
  const chatId = params.params.id;
  const queryClient = getQueryClient();

  const { isAuth, authCookies } = await getAuth(cookieStore);

  if (isAuth) await queryClient.prefetchQuery(Message(chatId, authCookies));

  return (
    <main className="flex-1 relative">
      <Client>
        {isAuth ? (
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Messages />
          </HydrationBoundary>
        ) : (
          <Messages />
        )}
      </Client>
    </main>
  );
}
