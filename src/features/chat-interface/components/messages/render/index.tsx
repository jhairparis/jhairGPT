import Image from "next/image";
import Markdown, { ReactRenderer } from "marked-react";
import "highlight.js/styles/tokyo-night-dark.css";
import Lowlight from "react-lowlight";
import "react-lowlight/all";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/features/shared/components/ui/card";
import Json from "highlight.js/lib/languages/json";
import { Checkbox } from "@/features/shared/components/ui/checkbox";
import React, { Fragment } from "react";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

Lowlight.registerLanguage("ipynb", Json);

const inlineRule =
  /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1(?=[\s?!\.,:？！。，：]|$)/;
const inlineRuleNoStart =
  /(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1(?=[\s?!\.,:？！。，：]|$)/g;

const inlineRuleNonStandard =
  /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1/; // Non-standard, even if there are no spaces before and after $ or $$, try to parse

const inlineRuleNonStandardNoStart =
  /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1/; // Non-standard, even if there are no spaces before and after $ or $$, try to parse

const processChildren = (children: any[]) => {
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

const blockRule = /^(\${1,2})\n((?:\\[^]|[^\\])+?)\n\1(?:\n|$)/;

// TODO: Just load the languages you need
const renderer: Partial<ReactRenderer> = {
  code(snippet: any, lang: any) {
    return (
      <Card
        className="overflow-hidden my-2 text-start"
        key={crypto.randomUUID()}
      >
        <CardHeader className="py-2 px-4 select-none">{lang}</CardHeader>
        <CardContent className="p-0">
          <Lowlight language={lang} value={snippet} markers={[]} />
        </CardContent>
      </Card>
    );
  },
  image(src, alt, title) {
    return (
      <Image
        src={src}
        alt={alt}
        title={title ?? undefined}
        width={280}
        height={280}
        key={crypto.randomUUID()}
      />
    );
  },
  checkbox(checked) {
    return <Checkbox checked={!!checked} key={crypto.randomUUID()} />;
  },
  strong(children) {
    return (
      <strong key={crypto.randomUUID()}>
        <Latex>{children as string}</Latex>
      </strong>
    );
  },
  blockquote(children) {
    return (
      <blockquote
        className="mt-6 border-l-2 pl-6 italic"
        key={crypto.randomUUID()}
      >
        {children}
      </blockquote>
    );
  },
  codespan(code, lang) {
    return (
      <code
        className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
        key={crypto.randomUUID()}
      >
        {code}
      </code>
    );
  },
  paragraph(children: any[]) {
    children = processChildren(children);

    return (
      <p className="leading-7 [&:not(:first-child)]:mt-6" key={crypto.randomUUID()}>
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
            while (
              (match = inlineRuleNonStandardNoStart.exec(child)) !== null
            ) {
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
  },
  list(children, order, start) {
    if (order)
      return (
        <ol
          className="my-6 ml-6 list-decimal [&>li]:mt-2"
          key={crypto.randomUUID()}
        >
          {children}
        </ol>
      );
    return (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2" key={crypto.randomUUID()}>
        {children}
      </ul>
    );
  },
  listItem(children) {
    if (children.length === 1) {
      const current = Array.isArray(children[0]) ? children[0][0] : [];

      if (typeof current === "string")
        return (
          <li key={crypto.randomUUID()}>
            <Latex>{current}</Latex>
          </li>
        );

      if (Array.isArray(current)) {
        return (
          <li key={crypto.randomUUID()}>
            {current.map((element, i) =>
              typeof element === "string" ? (
                <Latex key={crypto.randomUUID()}>{element}</Latex>
              ) : (
                <Fragment key={crypto.randomUUID()}>{element}</Fragment>
              )
            )}
          </li>
        );
      }

      return <li key={crypto.randomUUID()}>{current}</li>;
    }

    return (
      <li className="flex items-center space-x-2" key={crypto.randomUUID()}>
        {children.map((child, i) =>
          Object.hasOwnProperty.call(child, "props") ? (
            child
          ) : (
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              key={i}
            >
              <Latex>{child as string}</Latex>
            </label>
          )
        )}
      </li>
    );
  },
  table(children) {
    return (
      <div className="my-6 w-full overflow-y-auto" key={crypto.randomUUID()}>
        <table className="w-full">{children}</table>
      </div>
    );
  },
  tableBody(children) {
    return <tbody key={crypto.randomUUID()}>{children}</tbody>;
  },
  tableRow(children) {
    const isEmpty = children.every((child) => {
      if (React.isValidElement(child)) {
        const content = child.props.children;
        if (Array.isArray(content)) {
          return content.every((item) =>
            typeof item === "string" ? item.trim() === "" : !item
          );
        }
        if (typeof content === "string") {
          return content.trim() === "";
        }
        return !content;
      }

      if (typeof child === "string") {
        return child.trim() === "";
      }
      return true;
    });

    if (isEmpty) return <Fragment key={crypto.randomUUID()}></Fragment>;

    return (
      <tr className="m-0 border-t p-0 even:bg-muted" key={crypto.randomUUID()}>
        {children}
      </tr>
    );
  },
  tableHeader(children) {
    return <thead key={crypto.randomUUID()}>{children}</thead>;
  },
  tableCell(children, flags) {
    if (flags?.header)
      return (
        <th
          className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
          key={crypto.randomUUID()}
        >
          {children}
        </th>
      );

    return (
      <td
        className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
        key={crypto.randomUUID()}
      >
        {children}
      </td>
    );
  },
};

const Render = ({ content }: { content: string }) => {
  return <Markdown value={content} renderer={renderer} />;
};

export default Render;
