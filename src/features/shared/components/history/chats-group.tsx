import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu } from "../ui/sidebar";
import { ChatsItem } from "./chats-item";
import { DATE_GROUP_LABELS } from "../../constants/date-groups";

interface ChatGroupProps {
  groupKey: string;
  chats: any[];
  currentPath: string;
  onDeleteChat: (id: string) => void;
}

export const ChatsGroup = ({ groupKey, chats, currentPath, onDeleteChat }: ChatGroupProps) => {
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
                  isActive={currentPath === `/c/${chat.id}`}
                  onDelete={onDeleteChat}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};
