import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {},
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    // protect only these pages (NOT /api)
    "/items/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
