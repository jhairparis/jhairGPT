import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import useChat from "@/features/chat-interface/hooks/use-chat";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
} from "../../../shared/components/ui/sidebar";
import { ChatsItem } from "./chats-item";
import { DATE_GROUP_LABELS } from "../../constants/date-groups";
import { Chat } from "@/features/chat-interface/types";

interface ChatGroupProps {
  groupKey: string;
  chats: Chat[];
}

export const ChatsGroup = ({ groupKey, chats }: ChatGroupProps) => {
  const pathname = usePathname();
  const { deleteChat } = useChat();

  if (chats.length === 0) return null;

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
            {DATE_GROUP_LABELS[groupKey] || groupKey}
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>

        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <ChatsItem
                  key={chat.id}
                  chat={chat}
                  isActive={pathname === `/c/${chat.id}`}
                  onDelete={() => deleteChat.mutate({ id: chat.id, groupKey })}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};
