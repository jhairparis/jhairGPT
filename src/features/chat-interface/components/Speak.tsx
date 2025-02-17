"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import queryClientSpeak from "../constants/speak";
import Header from "@/features/shared/components/header";
import { TextInput } from "./text-input";

const Speak = ({ children }: any) => {
  return (
    <QueryClientProvider client={queryClientSpeak}>
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Header />
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
          <footer className="flex-none w-full min-w-80 min-h-20 max-w-4xl mx-auto relative">
            <TextInput />
          </footer>
        </div>
      </div>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

export default Speak;
