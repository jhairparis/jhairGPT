"use client";
import { useState } from "react";
import { createContext, useContext } from "react";

type ChatContextProps = Record<string, any>;

const ChatContext = createContext<ChatContextProps>({});

export const useChatContext = () => useContext<ChatContextProps>(ChatContext);

export const ChatProvider = ({ children }: any) => {
  const [chat, setChat] = useState({
    desktop: {
      historyOpen: false,
    },
    history: [],
  });

  return (
    <ChatContext.Provider value={{ chat, setChat }}>
      {children}
    </ChatContext.Provider>
  );
};
