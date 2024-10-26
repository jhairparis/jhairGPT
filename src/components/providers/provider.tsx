import { ChatProvider } from "@/features/chat-interface/providers/chat";
import { ThemeProvider } from "./theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

const Provider = ({ children }: any) => {
  return (
    <>
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
    </>
  );
};

export default Provider;
