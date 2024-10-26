"use client";
import { X, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import History from "./history";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import Ad from "./ad";

const AppSidebar = () => {
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
            <WandSparkles className="h-5 w-5" />
            <span className="sr-only">New chat</span>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <History />
      </SidebarContent>
      <SidebarFooter>
        <Ad />
      </SidebarFooter>
    </Sidebar>
  );
};
export default AppSidebar;
