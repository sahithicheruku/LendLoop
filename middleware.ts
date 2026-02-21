export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/items/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
