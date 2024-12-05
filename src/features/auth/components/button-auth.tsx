"use client";
import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useChatContext } from "../../chat-interface/providers/chat";
import { getSession } from "../utils/auth";

const ButtonAuth: React.FC = () => {
  const { chat, setChat } = useChatContext();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);

    const up = async () => {
      const data = await getSession();

      if (data !== undefined)
        setChat((prev) => ({
          ...prev,
          user: {
            data,
            authenticated: (data as object).hasOwnProperty("email"),
          },
        }));
    };

    up();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <User
              className={`h-5 w-5 ${
                chat.user.authenticated && "text-cyan-500"
              }`}
            />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {chat.user.authenticated ? (
            <>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <a
                href={`${process.env.NEXT_PUBLIC_AUTH}/signout?callbackUrl=${origin}`}
              >
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </a>
            </>
          ) : (
            <a
              href={`${process.env.NEXT_PUBLIC_AUTH}/signin?callbackUrl=${origin}`}
            >
              <DropdownMenuItem>Login</DropdownMenuItem>
            </a>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {!chat.user.authenticated && <ModeToggle />}
    </React.Fragment>
  );
};

export default ButtonAuth;
