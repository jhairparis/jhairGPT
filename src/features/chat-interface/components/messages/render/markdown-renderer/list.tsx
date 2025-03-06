const List = ({
  children,
  ordered,
  start,
}: {
  children: React.ReactNode;
  ordered?: boolean;
  start?: number;
}) => {
  if (ordered)
    return (
      <ol
        className="my-6 ml-6 list-decimal [&>li]:mt-2"
        key={crypto.randomUUID()}
        start={start}
      >
        {children}
      </ol>
    );
  return (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2" key={crypto.randomUUID()}>
      {children}
    </ul>
  );
};

export default List;
