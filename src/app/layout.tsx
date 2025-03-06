import type { Metadata } from "next";
import "./globals.css";
import LayoutProvider from "@/features/shared/providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Project",
  description: "The unique project",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
