"use client";
import useAuth from "../../hooks/use-auth";
import { Skeleton } from "@/features/shared/components/ui/skeleton";
import { LoginMenu } from "./login-menu";
import { GuestMenu } from "./guest-menu";

const UserActionButton = () => {
  const { data: user, isPending, isError, error } = useAuth();

  if (isPending) return <Skeleton className="h-10 w-10 rounded-full" />;

  if (isError)
    return (
      <div className="text-destructive" role="alert">
        {error.message}
      </div>
    );

  if (!user) return <GuestMenu />;

  return <LoginMenu />;
};

export default UserActionButton;
