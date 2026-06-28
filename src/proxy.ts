import { NextRequest, NextResponse } from "next/server";

// Protect every /admin route with HTTP Basic Auth.
// Any username is accepted; the password must equal ADMIN_PASSWORD.
export const config = { matcher: ["/admin/:path*"] };

export function proxy(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  const header = req.headers.get("authorization");

  if (expected && header?.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice("Basic ".length));
      const password = decoded.slice(decoded.indexOf(":") + 1);
      if (password === expected) {
        return NextResponse.next();
      }
    } catch {
      // fall through to the 401 below
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"' },
  });
}
