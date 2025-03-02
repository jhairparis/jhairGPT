import { Backend_url } from "@/features/shared/constants/query";
import { useQuery } from "@tanstack/react-query";

const getModels = async () => {
  const response = await fetch(`${Backend_url}/gpt/models`, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  return data.result;
};

const useModels = () => useQuery({ queryKey: ["models"], queryFn: getModels });

export default useModels;
