import { notFound } from "next/navigation";

const url = process.env.NEXT_PUBLIC_URL;

export const getChat = async (chatId: string) => {
  const info = await fetch(`${url}/gpt/chat/${chatId}`, {
    next: { revalidate: 60 },
  });

  const { result, message } = await info.json();

  if (info.status !== 200) return notFound();

  return result;
};

export const getChats = async () => {
  const info = await fetch(`${url}/gpt/chat`, {
    method: "get",
    credentials: "include",
  });

  const { result } = await info.json();

  console.debug(`Get all Chats '${url}/gpt/chat'\n result:`, result);

  return result;
};

export const deleteChat = (chatId: string) => {
  return fetch(`${url}/gpt/chat/${chatId}`, {
    method: "delete",
    credentials: "include",
  });
};

export const initializeChat = async (message: string, model: string) => {
  const response = await fetch(`${url}/gpt`, {
    method: "post",
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

  const res = await response.json();

  return res;
};

export const chatting = async (
  message: string,
  chatId: string,
  model: string
) => {
  const response = await fetch(`${url}/gpt`, {
    method: "put",
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

  const { result } = await response.json();

  console.debug(`Send message '${url}/gpt'\n result:`, result);

  return result;
};
