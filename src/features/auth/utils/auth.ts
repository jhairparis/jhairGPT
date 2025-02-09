import { AUTH_COOKIE, CSRF_COOKIE } from "@/features/shared/constants/cookies";

export async function getAuth(cookieStore: any) {
  const authCookies = [
    cookieStore.get(CSRF_COOKIE),
    cookieStore.get(AUTH_COOKIE),
  ];

  return {
    isAuth: authCookies[0] && authCookies[1],
    authCookies: authCookies,
  };
}
