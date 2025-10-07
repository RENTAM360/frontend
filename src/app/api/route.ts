import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ message: data.message || "Login failed" }, { status: res.status });
    }

    const profileRes = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/profile/me`, {
      headers: { Authorization: `Bearer ${data.data}` },
    });

    const profile = await profileRes.json();
    if (!profileRes.ok) {
      return NextResponse.json({ message: "Failed to fetch profile" }, { status: 500 });
    }

    const role = profile.data.user.role.name;

    const response = NextResponse.json({ success: true, role });

    response.cookies.set("auth_token", data.data, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
    });

    response.cookies.set("role", role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
