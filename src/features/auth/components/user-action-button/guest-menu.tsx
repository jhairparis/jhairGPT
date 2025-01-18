import { User } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import { ModeToggle } from "@/features/shared/components/ui/mode-toggle";

export const GuestMenu = () => {
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <a
              href={`${process.env.NEXT_PUBLIC_AUTH}/signin?callbackUrl=${origin}`}
            >
              <DropdownMenuItem>Login</DropdownMenuItem>
            </a>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
      <ModeToggle />
    </>
  );
};
