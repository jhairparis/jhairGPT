"use client";
import React, { ReactNode, useLayoutEffect, useRef } from "react";

const Client = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-y-auto">
      <div className="py-5 sm:py-10 lg:py-14">{children}</div>
    </div>
  );
};

export default Client;
