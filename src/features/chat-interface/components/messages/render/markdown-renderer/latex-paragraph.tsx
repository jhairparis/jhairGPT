import { Fragment } from "react";
import type { ReactNode } from "react";
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
  
  // Generate a unique ID for this paragraph instance
  const paragraphId = crypto.randomUUID();

  return (
    <p
      className="leading-7 [&:not(:first-child)]:mt-6"
      key={`latex-p-${paragraphId}`}
    >
      {children.map((child, i) => {
        if (typeof child !== "string") return <Fragment key={`non-string-${paragraphId}-${i}`}>{child}</Fragment>;

        if (
          child.match(inlineRule) ||
          child.match(inlineRuleNonStandard) ||
          child.match(blockRule)
        ) {
          return <Latex key={`latex-full-${paragraphId}-${i}`}>{child}</Latex>;
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

          return parts.map((part, j) =>
            part.match(inlineRuleNoStart) ? (
              <Latex key={`latex-inline-${paragraphId}-${i}-${j}`}>{part}</Latex>
            ) : (
              <Fragment key={`fragment-inline-${paragraphId}-${i}-${j}`}>
                {part}
              </Fragment>
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

          return parts.map((part, j) =>
            part.match(inlineRuleNonStandardNoStart) ? (
              <Latex key={`latex-nonstandard-${paragraphId}-${i}-${j}`}>{part}</Latex>
            ) : (
              <Fragment key={`fragment-nonstandard-${paragraphId}-${i}-${j}`}>
                {part}
              </Fragment>
            )
          );
        }

        return <Fragment key={`text-${paragraphId}-${i}`}>{child}</Fragment>;
      })}
    </p>
  );
};

export default LatexParagraph;
