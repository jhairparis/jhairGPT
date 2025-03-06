"use client";
import { ThemeProvider } from "@/features/shared/providers/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { GetQueryClientDynamic } from "@/features/shared/lib/query-client-dynamic";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type LayoutProviderProps = Readonly<{
  children: React.ReactNode;
}>;
const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const queryClient = GetQueryClientDynamic();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default LayoutProvider;
