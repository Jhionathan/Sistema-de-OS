import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/customers") ||
    pathname.startsWith("/units") ||
    pathname.startsWith("/equipment") ||
    pathname.startsWith("/technicians") ||
    pathname.startsWith("/visits");

  if (!isLoggedIn && isProtected) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }

  if (isLoggedIn && pathname === "/login") {
    return Response.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return;
});

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/customers/:path*",
    "/units/:path*",
    "/equipment/:path*",
    "/technicians/:path*",
    "/visits/:path*",
  ],
};