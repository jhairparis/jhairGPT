import { BiSolidErrorAlt } from "react-icons/bi";
import { ApiError } from "../../lib/ApiError";

interface ErrorStateProps {
  error: Error | null;
}

export const ChatsError = ({ error }: ErrorStateProps) => {
  if (error instanceof ApiError && error.status === 401) {
    return (
      <div className="flex flex-col items-center justify-center h-20 gap-2">
        <p>Please SignIn</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-20 gap-2">
      <BiSolidErrorAlt className="text-2xl text-red-700" />
      <p className="text-sm text-red-700">{error?.message}</p>
    </div>
  );
};
