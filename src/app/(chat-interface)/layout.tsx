import Provider from "@/features/chat-interface/providers";
import AppSidebar from "@/features/shared/components/sidebar";
import History from "@/features/shared/components/history";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClientDynamic } from "@/features/shared/lib/queryClientDynamic";
import { cookies } from "next/headers";
import { chatKeys } from "@/features/chat-interface/utils/chat-queries";
import { getChatsServer } from "@/features/chat-interface/utils/service-chat";
import { getAuth } from "@/features/auth/utils/auth";
import { SIDEBAR_COOKIE_NAME } from "@/features/shared/constants/sidebar";
import Speak from "@/features/chat-interface/components/Speak";

type ChatInterfaceLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function ChatInterfaceLayout({ children }: ChatInterfaceLayoutProps) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === "true";
  const { authCookies } = await getAuth(cookieStore);

  const queryClient = getQueryClientDynamic();

  await queryClient.prefetchQuery({
    queryKey: chatKeys.list(),
    queryFn: () => getChatsServer(authCookies),
    staleTime: 60 * 1000,
  });

  return (
    <Provider SideBarDefault={defaultOpen}>
      <AppSidebar>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <History />
        </HydrationBoundary>
      </AppSidebar>
      <div className="flex min-h-dvh w-full relative">
        <Speak>{children}</Speak>
      </div>
    </Provider>
  );
}
