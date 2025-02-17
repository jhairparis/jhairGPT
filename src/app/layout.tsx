import "./globals.css";
import Provider from "@/features/shared/providers/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { SIDEBAR_COOKIE_NAME } from "@/features/shared/constants/sidebar";

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

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Provider SideBarDefault={defaultOpen}>
          <div className="flex min-h-dvh w-full relative">{children}</div>
        </Provider>
      </body>
    </html>
  );
}
