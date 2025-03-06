import type { ReactNode } from "react";

const Table = ({ children }: { children: ReactNode }) => {
  return (
    <div className="my-6 w-full overflow-y-auto" key={crypto.randomUUID()}>
      <table className="w-full">{children}</table>
    </div>
  );
};

export default Table;
