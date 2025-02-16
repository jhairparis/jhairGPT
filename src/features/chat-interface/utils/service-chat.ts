import fetchApi from "@/features/shared/lib/fetchApi";
import type { PreferenceStoreState } from "@/features/shared/providers/preference-provider";
import { MarkdownItem } from "../components/text-input/text-input";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ChatHistory } from "../types";

export const getChatServer = async (
  chatId: string,
  cookies: Array<RequestCookie | undefined>
) => {
  const cookieHeader = cookies
    .filter((cookie): cookie is RequestCookie => cookie !== undefined)
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const { data } = await fetchApi.get<ChatHistory>(`/gpt/chat/${chatId}`, {
    headers: {
      Cookie: cookieHeader,
    },
    credentials: "include",
    next: { revalidate: 60 },
  });

  return data.result;
};

export const getChat = async (chatId: string) => {
  const { data } = await fetchApi.get<ChatHistory>(`/gpt/chat/${chatId}`, {
    credentials: "include",
    next: { revalidate: 60 },
  });

  return data.result;
};

export const getChatsServer = async (
  cookies: Array<RequestCookie | undefined>
) => {
  const cookieHeader = cookies
    .filter((cookie): cookie is RequestCookie => cookie !== undefined)
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const { data } = await fetchApi.get<any>(`/gpt/chat`, {
    headers: {
      Cookie: cookieHeader,
    },
    credentials: "include",
    next: { revalidate: 60 },
  });

  return data.result;
};

export const getChats = async () => {
  const { data } = await fetchApi.get<any>(`/gpt/chat`, {
    credentials: "include",
    next: { revalidate: 60 },
  });

  return data.result;
};

export const initializeChat = async (
  message: MarkdownItem[],
  model: PreferenceStoreState["currentModel"]
) => {
  const sendData = {
    message,
    model: model,
  };

  const { data } = await fetchApi.post<any>(`/gpt`, sendData, {
    credentials: "include",
    timeout: 20000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return data;
};

export const chatting = async (
  message: MarkdownItem[],
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
    timeout: 20000,
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
