import "./globals.css";
import Provider from "@/components/providers/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/app/header";
import AppSidebar from "@/components/app/sidebar";
import Messages from "@/features/chat-interface/components/messages";
import dynamic from "next/dynamic";

const TextInput = dynamic(
  () => import("@/features/chat-interface/components/text-input"),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "The unique project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <div className="flex min-h-dvh w-full relative">
            <AppSidebar />
            <div className="flex-1 flex flex-col transition-all duration-300">
              <Header />
              {children}
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
