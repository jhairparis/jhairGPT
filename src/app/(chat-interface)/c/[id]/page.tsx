import { getAuth } from "@/features/auth/utils/auth";
import Client from "@/features/chat-interface/components/Client";
import Messages from "@/features/chat-interface/components/messages";
import { MessageServer } from "@/features/chat-interface/utils/chat-queries";
import { GetQueryClientDynamic } from "@/features/shared/lib/query-client-dynamic";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";

type props = { params: { id: string } };

export default async function ChatInterface(params: props) {
  const cookieStore = cookies();
  const chatId = params.params.id;

  const queryClient = GetQueryClientDynamic();

  const { authCookies } = await getAuth(cookieStore);

  await queryClient.prefetchQuery(MessageServer(chatId, authCookies));

  return (
    <main className="flex-1 relative">
      <Client>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Messages />
        </HydrationBoundary>
      </Client>
    </main>
  );
}
