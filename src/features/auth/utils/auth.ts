const url = process.env.NEXT_PUBLIC_URL;

export const getSession = async () => {
  const response = await fetch(`${url}/auth/session`, {
    method: "get",
    credentials: "include",
  });
  const { user } = await response.json();

  return user;
};
