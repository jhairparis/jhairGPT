import type { PreferenceStoreState } from "@/features/shared/providers/preference-provider";
import { MarkdownItem } from "../components/text-input/text-input";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ChatHistory, ChatList } from "../types";
import { Backend_url } from "@/features/shared/constants/query";

const handleError = (error: any, where: string) => {
  return { message: error, where };
};

export const getChatServer = async (
  chatId: string,
  cookies: RequestCookie[] | null
) => {
  if (!cookies) throw new Error("No cookies");

  try {
    const cookieHeader = cookies
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
    const data = (await response.json()) as { result: ChatHistory["result"] };
    return data.result;
  } catch (error) {
    return { error: JSON.parse(error as string) };
  }
};

export const getChat = async (chatId: string) => {
  if (!chatId) throw new Error("No chatId");

  try {
    const response = await fetch(`${Backend_url}/gpt/chat/${chatId}`, {
      credentials: "include",
      next: { revalidate: 60 },
    });
    const data = (await response.json()) as { result: ChatHistory["result"] };
    return data.result;
  } catch (error) {
    return { error: JSON.parse(error as string) };
  }
};

export const getChatsServer = async (
  cookies: RequestCookie[] | undefined | null
) => {
  if (!cookies) throw new Error("No cookies");

  try {
    const cookieHeader = cookies
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

    if (!response.ok)
      return Promise.reject(handleError(response.statusText, "server1"));

    const data: { result: ChatList["result"] } = await response.json();

    return data.result;
  } catch (error) {
    return Promise.reject(handleError(error, "server"));
  }
};

export const getChats = async () => {
  const response = await fetch(`${Backend_url}/gpt/chat`, {
    credentials: "include",
    next: { revalidate: 20 },
  });

  const data: { result: ChatList["result"] } = await response.json();

  if (!data.result) return response.status;

  return data.result;
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

  const data: {
    result: ChatHistory["result"];
    chatId: string;
    message: string;
  } = await response.json();

  return data;
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
  const data = (await response.json()) as { result: ChatHistory["result"] };
  return data.result;
};

export const removeChatById = async (chatId: string) => {
  const response = await fetch(`${Backend_url}/gpt/chat/${chatId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await response.json();
  return data.result;
};
