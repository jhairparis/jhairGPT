"use client";
import { WandSparkles } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import {
  SidebarTrigger,
  useSidebar,
} from "@/features/shared/components/ui/sidebar";
import Link from "next/link";
import UserActionButton from "@/features/auth/components/user-action-button";

const Header = () => {
  const stateSidebar = useSidebar();

  return (
    <header className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6">
      <div className="w-full flex-1 flex flex-row gap-4">
        {!stateSidebar.open && (
          <>
            <SidebarTrigger />

            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
              <Link href="/">
                <WandSparkles />
                <span className="sr-only">New chat</span>
              </Link>
            </Button>
          </>
        )}
        <div className="relative">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select your AI" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select model</SelectLabel>
                <SelectItem value="apple">Agent</SelectItem>
                <SelectItem value="banana">Gemini</SelectItem>
                <SelectItem value="bananax">OpenAi</SelectItem>
                <SelectItem value="bananaxx">Fast</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <UserActionButton />
    </header>
  );
};

export default Header;
