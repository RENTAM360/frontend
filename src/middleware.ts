import { NextRequest, NextResponse } from "next/server";

const userProtectedRoutes = ["/dashboard"];
const adminProtectedRoutes = ["/admin"];
const publicRoutes = ["/", "/login", "/signup", "/admin/login"];

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const role = req.cookies.get("role")?.value;
  const path = req.nextUrl.pathname;

  const isUserProtected = userProtectedRoutes.some((route) => path.startsWith(route));
  const isAdminProtected =
    adminProtectedRoutes.some((route) => path.startsWith(route)) && !path.startsWith("/admin/login");
  const isPublic = publicRoutes.includes(path);

  if (isPublic) {
    if (path === "/admin/login" && token && ["admin", "super-admin"].includes(role || "")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (path === "/login" && token && role === "user") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if ((isUserProtected || isAdminProtected) && !token) {
    const redirectTo = isAdminProtected ? "/admin/login" : "/login";
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  if (isAdminProtected && token && !["admin", "super-admin"].includes(role || "")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isUserProtected && ["admin", "super-admin"].includes(role || "")) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
