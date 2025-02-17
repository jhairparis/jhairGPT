import { AUTH_COOKIE, CSRF_COOKIE } from "@/features/shared/constants/cookies";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function getAuth(cookieStore: ReadonlyRequestCookies) {
  const _1 = cookieStore.get(CSRF_COOKIE);
  const _2 = cookieStore.get(AUTH_COOKIE);

  let authCookies;
  if (!(_1 && _2)) authCookies = null;
  else authCookies = [_1, _2];

  return {
    isAuth: _1 && _2,
    authCookies: authCookies,
  };
}
