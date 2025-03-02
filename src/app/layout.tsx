import "./globals.css";
import Provider from "@/features/shared/providers/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Project",
  description: "The unique project",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
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
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
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
      </body>
    </html>
  );
}
