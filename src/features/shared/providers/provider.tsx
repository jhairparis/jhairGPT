"use client";
import { ThemeProvider } from "./theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/features/shared/lib/queryClient";
import { PreferenceProvider } from "./preference-provider";

const Provider = ({ children }: any) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <PreferenceProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </PreferenceProvider>
    </QueryClientProvider>
  );
};

export default Provider;
