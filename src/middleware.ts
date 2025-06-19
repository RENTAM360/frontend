import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export default function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  const path = req.nextUrl.pathname

  
  const isProtected = protectedRoutes.some(route => path.startsWith(route))
  const isPublic = publicRoutes.includes(path)

  // 🚫 Not authenticated on a protected page
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // ✅ Already authenticated and trying to visit login/signup
  if (isPublic && token && !path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
