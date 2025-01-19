import "./globals.css";
import Provider from "@/features/shared/providers/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/features/shared/components/header";
import AppSidebar from "@/features/shared/components/sidebar";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import SidebarProvider  from "@/features/shared/components/ui/sidebar/sidebar-provider";
import { SIDEBAR_COOKIE_NAME } from "@/features/shared/lib/utils";

const TextInput = dynamic(
  () => import("@/features/chat-interface/components/text-input"),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Project",
  description: "The unique project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === "true"

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <div className="flex min-h-dvh w-full relative">
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar />
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
