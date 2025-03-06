import type { ReactNode } from "react";

export const inlineRule =
  /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1(?=[\s?!\.,:？！。，：]|$)/;
export const inlineRuleNoStart =
  /(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1(?=[\s?!\.,:？！。，：]|$)/g;

export const inlineRuleNonStandard =
  /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1/;

export const inlineRuleNonStandardNoStart =
  /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1/;

export const blockRule = /^(\${1,2})\n((?:\\[^]|[^\\])+?)\n\1(?:\n|$)/;

export const processChildren = (children: ReactNode[]) => {
  if (children.every((child) => typeof child === "string"))
    children = [children.join("")];

  const newChildren: any[] = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (typeof child === "string" && (child === "$$" || child === "$")) {
      const segmentTokens: any[] = [child];
      let foundClosing = false;
      i++;
      while (i < children.length) {
        const inner = children[i];
        if (typeof inner === "string" && (inner === "$$" || inner === "$")) {
          foundClosing = true;
          segmentTokens.push(inner);
          break;
        }

        if (
          typeof inner !== "string" &&
          !(typeof inner === "object" && inner && "type" in inner)
        ) {
          segmentTokens.length = 0;
          break;
        }
        segmentTokens.push(inner);
        i++;
      }
      if (foundClosing && segmentTokens.length > 0) {
        const merged = segmentTokens
          .map((tok) => {
            if (typeof tok === "string") {
              if (tok === "\\") return "\\\\";
              return tok;
            } else {
              return "\n";
            }
          })
          .join("");
        newChildren.push(merged);
      } else {
        newChildren.push(child);
        for (const tok of segmentTokens) {
          newChildren.push(tok);
        }
      }
    } else {
      newChildren.push(child);
    }
  }

  const mergedChildren: any[] = [];
  for (const child of newChildren) {
    const last = mergedChildren[mergedChildren.length - 1];
    if (typeof child === "string" && typeof last === "string") {
      mergedChildren[mergedChildren.length - 1] = last + child;
    } else {
      mergedChildren.push(child);
    }
  }

  return mergedChildren;
};
