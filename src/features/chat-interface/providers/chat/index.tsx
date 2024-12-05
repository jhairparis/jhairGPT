"use client";
import { useState, createContext, useContext } from "react";

type ChatState = {
  user: {
    data: Record<string, any>;
    authenticated: boolean;
  };
  desktop: {
    historyOpen: boolean;
  };
  currentChat: {
    history?: any[];
    chatQuestions?: any[];
    historyInfo?: any[];
  };
};

type ChatContextType = {
  chat: ChatState;
  setChat: React.Dispatch<React.SetStateAction<ChatState>>;
};

export const defaultChatState: ChatState = {
  user: {
    data: {},
    authenticated: false,
  },
  desktop: {
    historyOpen: false,
  },
  currentChat: {
    history: [],
    chatQuestions: [],
    historyInfo: [],
  },
};

const ChatContext = createContext<ChatContextType>({
  chat: defaultChatState,
  setChat: () => {},
});

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }: any) => {
  const [chat, setChat] = useState(defaultChatState);

  return (
    <ChatContext.Provider value={{ chat, setChat }}>
      {children}
    </ChatContext.Provider>
  );
};
