import fetchApi from "@/features/shared/lib/fetchApi";
import type { PreferenceStoreState } from "@/features/shared/providers/preference-provider";

export const getChat = async (chatId: string) => {
  const { data } = await fetchApi.get<any>(`/gpt/chat/${chatId}`, {
    next: { revalidate: 60 },
  });

  return data.result;
};

export const getChats = async () => {
  const { data } = await fetchApi.get<any>(`/gpt/chat`, {
    credentials: "include",
  });

  return data.result;
};

export const initializeChat = async (
  message: string,
  model: PreferenceStoreState["currentModel"]
) => {
  const sendData = {
    message,
    model: model,
  };

  const { data } = await fetchApi.post<any>(`/gpt`, sendData, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return data;
};

export const chatting = async (
  message: string,
  chatId: string,
  model: PreferenceStoreState["currentModel"]
) => {
  const sendData = {
    message,
    chatId: chatId,
    model: model,
  };

  const { data } = await fetchApi.put<any>(`/gpt`, sendData, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    next: { revalidate: 120 },
  });

  return data.result;
};

export const removeChatById = async (chatId: string) => {
  const { data } = await fetchApi.delete<any>(`/gpt/chat/${chatId}`, {
    credentials: "include",
  });
  return data.result;
};
