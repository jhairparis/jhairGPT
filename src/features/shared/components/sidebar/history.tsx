"use client";
import Link from "next/link";
import {
  ChevronDown,
  LineChart,
  MoreHorizontal,
  Pen,
  Trash2
} from "lucide-react";
import { BiSolidErrorAlt } from "react-icons/bi";
import { AiOutlineLoading } from "react-icons/ai";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/features/shared/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { usePathname } from "next/navigation";
import useChat from "@/features/chat-interface/hooks/useChat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const History = () => {
  const pathname = usePathname();
  const { chatsQuery, deleteChat } = useChat();
  const { isPending, isError, data, error } = chatsQuery;

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-20">
        <AiOutlineLoading className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    if (error.message === "Error 401: Unauthorized")
      return (
        <div className="flex flex-col items-center justify-center h-20 gap-2">
          <p>Please SignIn</p>
        </div>
      );

    return (
      <div className="flex flex-col items-center justify-center h-20 gap-2">
        <BiSolidErrorAlt className="text-2xl text-red-700" />
        <p className="text-sm text-red-700">
          {error?.message || "Failed to load chats"}
        </p>
      </div>
    );
  }

  return (
    <>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              Hoy
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>

          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.map((chat: any) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/c/${chat.id}`}
                    >
                      <Link href={`/c/${chat.id}`}>
                        <LineChart className="h-5 w-5" />
                        <span>{chat.title.slice(0, 20)}</span>
                      </Link>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <Pen />
                            <span>Rename</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteChat.mutate({ id: chat.id })}
                          >
                            <Trash2 />
                            <span>Delete chat</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    </>
  );
};

export default History;
