import { Backend_url } from "@/features/shared/constants/query";
import { useQuery } from "@tanstack/react-query";
import { ModelsSchema } from "../types/model-document";

const getModels = async () => {
  const response = await fetch(`${Backend_url}/gpt/models`, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.error);

  const validatedData = ModelsSchema.parse(data.result);

  return validatedData;
};

const useModels = () => useQuery({ queryKey: ["models"], queryFn: getModels });

export default useModels;
