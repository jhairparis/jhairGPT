import Link from "next/link";
import { LineChart, MoreHorizontal, Pen, Trash2 } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuAction } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ChatsItemProps {
  chat: any;
  isActive: boolean;
  onDelete: (id: string) => void;
}

export const ChatsItem = ({ chat, isActive, onDelete }: ChatsItemProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
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
            <DropdownMenuItem onClick={() => onDelete(chat.id)}>
              <Trash2 />
              <span>Delete chat</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};
