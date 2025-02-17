import "./globals.css";
import Provider from "@/features/shared/providers/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppSidebar from "@/features/shared/components/sidebar";
import { cookies } from "next/headers";
import { SIDEBAR_COOKIE_NAME } from "@/features/shared/constants/sidebar";
import History from "@/features/shared/components/history";
import { getQueryClientDynamic } from "@/features/shared/lib/queryClientDynamic";
import { ConversationsServer } from "@/features/chat-interface/utils/chat-queries";
import { getAuth } from "@/features/auth/utils/auth";
import Speak from "@/features/chat-interface/components/Speak";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

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
  const queryClient = getQueryClientDynamic();

  const defaultOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === "true";

  const { authCookies } = await getAuth(cookieStore);

  await queryClient.prefetchQuery(ConversationsServer(authCookies));

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Provider SideBarDefault={defaultOpen}>
          <div className="flex min-h-dvh w-full relative">
            <AppSidebar>
              <HydrationBoundary state={dehydrate(queryClient)}>
                <History />
              </HydrationBoundary>
            </AppSidebar>
            <Speak>{children}</Speak>
          </div>
        </Provider>
      </body>
    </html>
  );
}
