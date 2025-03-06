import { Backend_url } from "@/features/shared/constants/query";
import { useQuery } from "@tanstack/react-query";

const getSession = async () => {
  const response = await fetch(`${Backend_url}/auth/session`, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) return null;

  const data = await response.json();

  if (!data || Object.keys(data).length === 0) return null;

  return data.user;
};

const useAuth = () => useQuery({ queryKey: ["session"], queryFn: getSession });

export default useAuth;
