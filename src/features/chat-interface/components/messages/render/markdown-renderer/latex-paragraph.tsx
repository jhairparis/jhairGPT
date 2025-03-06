import React, { ReactNode } from "react";
import Latex from "react-latex-next";
import {
  inlineRule,
  inlineRuleNoStart,
  inlineRuleNonStandard,
  inlineRuleNonStandardNoStart,
  blockRule,
  processChildren,
} from "../../../../utils/latex";

const LatexParagraph = ({ children }: { children: ReactNode[] }) => {
  children = processChildren(children);

  return (
    <p
      className="leading-7 [&:not(:first-child)]:mt-6"
      key={crypto.randomUUID()}
    >
      {children.map((child, i) => {
        if (typeof child !== "string") return child;

        if (
          child.match(inlineRule) ||
          child.match(inlineRuleNonStandard) ||
          child.match(blockRule)
        ) {
          return <Latex key={i}>{child}</Latex>;
        }

        if (child.match(inlineRuleNoStart)) {
          const parts: string[] = [];
          let lastIndex = 0;
          let match: RegExpExecArray | null;
          while ((match = inlineRuleNoStart.exec(child)) !== null) {
            const index = match.index;
            parts.push(child.slice(lastIndex, index));
            parts.push(match[0]);
            lastIndex = inlineRuleNoStart.lastIndex;
          }
          parts.push(child.slice(lastIndex));

          return parts.map((part, idx) =>
            part.match(inlineRuleNoStart) ? (
              <Latex key={idx}>{part}</Latex>
            ) : (
              part
            )
          );
        }

        if (child.match(inlineRuleNonStandardNoStart)) {
          const parts: string[] = [];
          let lastIndex = 0;
          let match: RegExpExecArray | null;
          while ((match = inlineRuleNonStandardNoStart.exec(child)) !== null) {
            const index = match.index;
            parts.push(child.slice(lastIndex, index));
            parts.push(match[0]);
            lastIndex = inlineRuleNonStandardNoStart.lastIndex;
          }
          parts.push(child.slice(lastIndex));

          return parts.map((part, idx) =>
            part.match(inlineRuleNonStandardNoStart) ? (
              <Latex key={idx}>{part}</Latex>
            ) : (
              part
            )
          );
        }

        return child;
      })}
    </p>
  );
};

export default LatexParagraph;
