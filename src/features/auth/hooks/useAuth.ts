import fetchApi from "@/features/shared/lib/fetchApi";
import { useQuery } from "@tanstack/react-query";

const getSession = async () => {
  const response = await fetchApi.get<any>("/auth/session", {
    credentials: "include",
  });

  if (!response.data || Object.keys(response.data).length === 0) return null;

  return response.data.user;
};

const useAuth = () => {
  return useQuery({ queryKey: ["session"], queryFn: getSession });
};

export default useAuth;
