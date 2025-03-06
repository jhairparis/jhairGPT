"use client";
import { ThemeProvider } from "./theme-provider";
import { getQueryClientDynamic } from "@/features/shared/lib/queryClientDynamic";
import { PreferenceProvider } from "./preference-provider";
import SidebarProvider from "@/features/shared/components/ui/sidebar/sidebar-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";

const Provider = ({ children, SideBarDefault }: any) => {
  const queryClient = getQueryClientDynamic();
  const { resolvedTheme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider defaultOpen={SideBarDefault}>
          <PreferenceProvider>{children}</PreferenceProvider>
        </SidebarProvider>
        <Toaster
          theme={
            resolvedTheme === "light" || resolvedTheme === "dark"
              ? resolvedTheme
              : "system"
          }
          position="top-center"
        />
      </ThemeProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Provider;
