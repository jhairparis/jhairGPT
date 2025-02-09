import "./globals.css";
import Provider from "@/features/shared/providers/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/features/shared/components/header";
import AppSidebar from "@/features/shared/components/sidebar";
import { cookies } from "next/headers";
import SidebarProvider from "@/features/shared/components/ui/sidebar/sidebar-provider";
import { SIDEBAR_COOKIE_NAME } from "@/features/shared/constants/sidebar";
import { AUTH_COOKIE, CSRF_COOKIE } from "@/features/shared/constants/cookies";
import History from "@/features/shared/components/history";
import { getQueryClient } from "@/features/shared/lib/queryClient";
import { Conversations } from "@/features/chat-interface/utils/chat-queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { TextInput } from "@/features/chat-interface/components/text-input";

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
  const queryClient = getQueryClient();

  const defaultOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === "true";
  const authCookies = [
    cookieStore.get(CSRF_COOKIE),
    cookieStore.get(AUTH_COOKIE),
  ];

  await queryClient.prefetchQuery(Conversations(authCookies));

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <div className="flex min-h-dvh w-full relative">
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar>
                <HydrationBoundary state={dehydrate(queryClient)}>
                  <History />
                </HydrationBoundary>
              </AppSidebar>
              <div className="flex-1 flex flex-col transition-all duration-300">
                <Header />
                <div className="flex-1 flex flex-col overflow-hidden">
                  {children}
                  <footer className="flex-none w-full min-w-80 min-h-20 max-w-4xl mx-auto relative">
                    <TextInput />
                  </footer>
                </div>
              </div>
            </SidebarProvider>
          </div>
        </Provider>
      </body>
    </html>
  );
}
