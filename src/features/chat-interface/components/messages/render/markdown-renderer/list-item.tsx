import React, { Fragment } from "react";
import Latex from "react-latex-next";

const ListItem = ({ children }: { children: any }) => {
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
      {children.map((child: any, i: number) =>
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
};

export default ListItem;
