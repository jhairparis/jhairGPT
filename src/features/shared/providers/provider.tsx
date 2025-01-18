import { ThemeProvider } from "./theme-provider";
import { SidebarProvider } from "@/features/shared/components/ui/sidebar";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import queryClient from "@/features/shared/lib/queryClient";
import { PreferenceProvider } from "./preference-provider";

const Provider = ({ children }: any) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PreferenceProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </PreferenceProvider>
    </QueryClientProvider>
  );
};

export default Provider;
