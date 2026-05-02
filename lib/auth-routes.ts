export const SIGN_IN_URL =
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in";
export const SIGN_UP_URL =
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up";
export const AFTER_AUTH_URL = "/editor";

export function getPathFromUrl(url: string) {
  return new URL(url, "http://localhost").pathname;
}
