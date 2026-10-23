import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

// /opengraph-image has no file extension, so the matcher below doesn't skip it; crawlers must reach it signed out.
const isPublicPage = createRouteMatcher(["/", "/sign-in", "/privacy", "/bookmarklet/save", "/api/bookmarklet", "/opengraph-image"]);
const isAuthPage = createRouteMatcher(["/sign-in"]);
const isLandingPage = createRouteMatcher(["/"]);

const handler = convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (!isPublicPage(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/sign-in");
  }
  if ((isAuthPage(request) || isLandingPage(request)) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/app");
  }
});

export { handler as proxy };
export default handler;

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
