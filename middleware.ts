import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // you can leave this empty; withAuth handles redirect
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // logged in = allowed
    },
  }
);

export const config = {
  matcher: ["/items/:path*", "/admin/:path*", "/dashboard/:path*"],
};
