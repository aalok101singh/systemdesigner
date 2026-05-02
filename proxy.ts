import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { getPathFromUrl, SIGN_IN_URL, SIGN_UP_URL } from "@/lib/auth-routes";

const signInPath = getPathFromUrl(SIGN_IN_URL);
const signUpPath = getPathFromUrl(SIGN_UP_URL);

const isPublicRoute = createRouteMatcher([
  `${signInPath}(.*)`,
  `${signUpPath}(.*)`,
]);

export default clerkMiddleware(async (auth, request) => {
  const signInUrl = new URL(signInPath, request.url).toString();

  if (!isPublicRoute(request)) {
    await auth.protect({ unauthenticatedUrl: signInUrl });
  }
}, (request) => {
  return {
    signInUrl: new URL(signInPath, request.url).toString(),
    signUpUrl: new URL(signUpPath, request.url).toString(),
  };
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
