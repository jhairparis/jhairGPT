const TableCell = ({
  children,
  isHeader,
}: {
  children: React.ReactNode;
  isHeader?: boolean;
}) => {
  if (isHeader)
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
};

export default TableCell;
