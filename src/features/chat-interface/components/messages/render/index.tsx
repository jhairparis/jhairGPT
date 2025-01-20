"use client";
import dynamic from "next/dynamic";

export const RenderMarkdown = dynamic(() => import("./render"), { ssr: false });
