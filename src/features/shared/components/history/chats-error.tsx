import { BiSolidErrorAlt } from "react-icons/bi";

interface ErrorStateProps {
  error: Error;
}

export const ChatsError = ({ error }: ErrorStateProps) => {
  if (error.message === "Error 401: Unauthorized") {
    return (
      <div className="flex flex-col items-center justify-center h-20 gap-2">
        <p>Please SignIn</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-20 gap-2">
      <BiSolidErrorAlt className="text-2xl text-red-700" />
      <p className="text-sm text-red-700">
        {error?.message || "Failed to load chats"}
      </p>
    </div>
  );
};
