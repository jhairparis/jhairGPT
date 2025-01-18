import fetchApi from "@/features/shared/lib/fetchApi";
import { useQuery } from "@tanstack/react-query";

const getModels = async () => {
  const response = await fetchApi.get<any>(`/gpt/models`, {
    credentials: "include",
  });

  return response.data.result;
};

const useModels = () => {
  return useQuery({ queryKey: ["models"], queryFn: getModels });
};

export default useModels;
