import { BiSolidErrorAlt } from "react-icons/bi";

interface ErrorStateProps {
  error: Error | null | number;
}

export const ChatsError = ({ error }: ErrorStateProps) => {
  if (error === null) {
    return (
      <div className="flex flex-col items-center justify-center h-20 gap-2">
        <p>Please sign in to continue</p>
      </div>
    );
  }

  if (typeof error === "number" && error === 500) {
    return (
      <div className="flex flex-col items-center justify-center h-20 gap-2">
        <BiSolidErrorAlt className="text-2xl text-red-700" />
        <p>Oops! Server took a coffee break. ☕</p>
        <p>It&#39;ll be back soon, we hope...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-20 gap-2">
      <BiSolidErrorAlt className="text-2xl text-red-700" />
      <p className="text-sm text-red-700">
        {error instanceof Error
          ? error.message
          : "An unexpected error occurred"}
      </p>
    </div>
  );
};
