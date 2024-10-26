export const process = (co: any) => {
  const p =co.map((c: any) => {
    if (c.type === "text") {
      return c.text;
    }
  });
  return p.join("\n");
};