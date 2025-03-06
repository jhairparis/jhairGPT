import React from "react";
import type { ReactNode } from "react";
import type { ReactRenderer } from "marked-react";
import List from "./list";
import Table from "./table";
import Image from "next/image";
import TableRow from "./table-row";
import ListItem from "./list-item";
import Latex from "react-latex-next";
import TableCell from "./table-cell";
import CodeBlock from "./code-block";
import LatexParagraph from "./latex-paragraph";
import { Checkbox } from "@/features/shared/components/ui/checkbox";

const markdownRenderer: Partial<ReactRenderer> = {
  code(snippet, lang) {
    return <CodeBlock snippet={snippet as string} lang={lang as string} />;
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
        {typeof children === "string" ? (
          <Latex>{children}</Latex>
        ) : (
          React.Children.map(children, (child) =>
            typeof child === "string" ? (
              <Latex key={crypto.randomUUID()}>{child}</Latex>
            ) : (
              child
            )
          )
        )}
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

  codespan(code) {
    return (
      <code
        className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
        key={crypto.randomUUID()}
      >
        {code}
      </code>
    );
  },

  paragraph(children) {
    return (
      <LatexParagraph key={crypto.randomUUID()}>
        {children as ReactNode[]}
      </LatexParagraph>
    );
  },

  list(children, ordered, start) {
    return (
      <List ordered={ordered} start={start} key={crypto.randomUUID()}>
        {children}
      </List>
    );
  },

  listItem(children) {
    return <ListItem key={crypto.randomUUID()}>{children}</ListItem>;
  },

  table(children) {
    return <Table>{children}</Table>;
  },

  tableRow(children) {
    return <TableRow>{children}</TableRow>;
  },

  tableCell(children, flags) {
    return <TableCell isHeader={flags?.header}>{children}</TableCell>;
  },
};

export default markdownRenderer;
