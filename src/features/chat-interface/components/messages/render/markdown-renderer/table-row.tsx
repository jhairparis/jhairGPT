import { Fragment, isValidElement } from "react";
import type { ReactNode } from "react";

const TableRow = ({ children }: { children: ReactNode[] }) => {
  const isEmpty = children.every((child) => {
    if (isValidElement(child)) {
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
};

export default TableRow;
