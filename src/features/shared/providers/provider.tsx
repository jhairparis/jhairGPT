import { ChatProvider } from "@/features/chat-interface/providers/chat";
import { ThemeProvider } from "./theme-provider";
import { SidebarProvider } from "@/features/shared/components/ui/sidebar";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import queryClient from "@/features/shared/lib/queryClient";

const Provider = ({ children }: any) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider defaultOpen={false}>
          <ChatProvider>{children}</ChatProvider>
        </SidebarProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Provider;
