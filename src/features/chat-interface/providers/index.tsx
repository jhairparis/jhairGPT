"use client";
import { PreferenceProvider } from "../../shared/providers/preference-provider";
import SidebarProvider from "@/features/shared/components/ui/sidebar/sidebar-provider";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";

const Provider = ({ children, SideBarDefault }: any) => {
  const { resolvedTheme } = useTheme();

  return (
    <>
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
    </>
  );
};

export default Provider;
