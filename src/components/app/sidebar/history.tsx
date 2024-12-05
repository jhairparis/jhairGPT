"use client";
import Link from "next/link";
import {
  BotMessageSquare,
  ChevronDown,
  Package,
  LineChart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useRef } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { getChats } from "@/features/chat-interface/utils/service-chat";
import { usePathname } from "next/navigation";

const History = () => {
  const [chats, setChats] = useState<any[]>([]);
  const pathname = usePathname();
  const hasFetchedChats = useRef(false);

  useEffect(() => {
    if (!hasFetchedChats.current) {
      hasFetchedChats.current = true;
      (async () => {
        setChats(await getChats());
      })();
    }
  }, []);

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              Help
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent>
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <BotMessageSquare className="h-4 w-4" />
                New banna red
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  1
                </Badge>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Products
              </Link>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
      {chats.map((chat) => (
        <Link
          key={chat.id}
          href={`/c/${chat.id}`}
          className={
            "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground truncate overflow-hidden" +
            (pathname.split("/c/")[1] === chat.id ? " bg-muted" : "")
          }
        >
          <LineChart className="h-5 w-5" />
          {chat.title.slice(0, 20)}
        </Link>
      ))}
    </nav>
  );
};

export default History;
