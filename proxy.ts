import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

// Pages that require no login (unauthenticated users may visit freely)
const isPublicPage = createRouteMatcher(["/sign-in", "/bookmarklet/save", "/api/bookmarklet"]);
// Pages that should redirect authenticated users away (i.e. the sign-in page)
const isAuthPage = createRouteMatcher(["/sign-in"]);

const handler = convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (!isPublicPage(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/sign-in");
  }
  if (isAuthPage(request) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/");
  }
});

export { handler as proxy };
export default handler;

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
