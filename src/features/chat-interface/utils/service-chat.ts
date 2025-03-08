import type { PreferenceStoreState } from "@/features/shared/providers/preference-provider";
import { MarkdownItem } from "../components/text-input/text-input";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { Backend_url } from "@/features/shared/constants/query";
import {
  ChatHistoryApi,
  ChatListApi,
  InitChatApi,
  UpdateChatApi,
} from "../types/service-chat";

export const getChatServer = async (
  chatId: string,
  cookies: RequestCookie[] | null
) => {
  try {
    let cookieHeader = "";

    if (cookies)
      cookieHeader = cookies
        .filter((cookie): cookie is RequestCookie => cookie !== undefined)
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

    const response = await fetch(`${Backend_url}/gpt/chat/${chatId}`, {
      headers: {
        Cookie: cookieHeader,
      },
      credentials: "include",
      next: { revalidate: 60 },
    });

    if (!response.ok) return null;

    const valid = ChatHistoryApi.parse(await response.json());

    return valid.result;
  } catch (error) {
    return null;
  }
};

export const getChat = async (chatId: string) => {
  try {
    if (!chatId) throw new Error("No chatId");

    const response = await fetch(`${Backend_url}/gpt/chat/${chatId}`, {
      credentials: "include",
      next: { revalidate: 60 },
    });

    if (!response.ok) return null;

    const valid = ChatHistoryApi.parse(await response.json());

    return valid.result;
  } catch (error) {
    return null;
  }
};

export const getChatsServer = async (
  cookies: RequestCookie[] | undefined | null
) => {
  try {
    let cookieHeader = "";

    if (cookies)
      cookieHeader = cookies
        .filter((cookie): cookie is RequestCookie => cookie !== undefined)
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

    const response = await fetch(`${Backend_url}/gpt/chat`, {
      headers: {
        Cookie: cookieHeader,
      },
      credentials: "include",
      next: { revalidate: 20 },
    });

    if (!response.ok) return null;

    const valid = ChatListApi.parse(await response.json());

    return valid.result;
  } catch (error) {
    return null;
  }
};

export const getChats = async () => {
  try {
    const response = await fetch(`${Backend_url}/gpt/chat`, {
      credentials: "include",
      next: { revalidate: 20 },
    });

    if (!response.ok) return null;

    const valid = ChatListApi.parse(await response.json());

    return valid.result;
  } catch (error) {
    return null;
  }
};

export const initializeChat = async (
  message: MarkdownItem[],
  model: PreferenceStoreState["currentModel"]
) => {
  const response = await fetch(`${Backend_url}/gpt`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      model: model,
    }),
  });

  const data = await response.json();

  const valid = InitChatApi.parse(data);

  return valid;
};

export const chatting = async (
  message: MarkdownItem[],
  chatId: string,
  model: PreferenceStoreState["currentModel"]
) => {
  const response = await fetch(`${Backend_url}/gpt`, {
    method: "PUT",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      chatId: chatId,
      model: model,
    }),
    next: { revalidate: 120 },
  });

  const valid = UpdateChatApi.parse(await response.json());

  return valid.result;
};

export const removeChatById = async (chatId: string) => {
  const response = await fetch(`${Backend_url}/gpt/chat/${chatId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await response.json();
  return data.result;
};
