"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WandSparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ModeToggle />
    </header>
  );
};

export default Header;
