"use client";
import dynamic from "next/dynamic";

export const TextInput = dynamic(() => import("./text-input"), { ssr: false });
