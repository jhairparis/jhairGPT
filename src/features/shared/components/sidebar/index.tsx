"use client";
import { X, WandSparkles } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/features/shared/components/ui/sidebar";
import Ad from "./ad";
import Link from "next/link";
import type { ReactNode } from "react";

type AppSidebarProps = Readonly<{ children: ReactNode }>;

const AppSidebar = ({ children }: AppSidebarProps) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="w-full flex flex-row justify-between">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 inline-flex"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close navigation menu desktop</span>
          </Button>

          <Button variant="outline" size="icon" className="ml-auto">
            <Link href="/">
              <WandSparkles className="h-5 w-5" />
              <span className="sr-only">New chat</span>
            </Link>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">{children}</SidebarContent>
      <SidebarFooter>
        <Ad />
      </SidebarFooter>
    </Sidebar>
  );
};
export default AppSidebar;
