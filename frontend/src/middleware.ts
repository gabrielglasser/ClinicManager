import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Verificar token no cookie
  const tokenFromCookie = request.cookies.get("token")?.value;
  
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Se não houver token no cookie e não estiver na rota de autenticação, redirecionar para login
  if (!tokenFromCookie && !request.nextUrl.pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Se houver token e tentar acessar login, redirecionar para dashboard
  if (tokenFromCookie && request.nextUrl.pathname.startsWith("/auth/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Verificar validade do token
  if (tokenFromCookie && !request.nextUrl.pathname.startsWith("/auth/")) {
    try {
      const response = await fetch("http://localhost:4000/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${tokenFromCookie}`,
        },
      });

      if (!response.ok) {
        const response = NextResponse.redirect(new URL("/auth/login", request.url));
        response.cookies.delete("token");
        return response;
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL("/auth/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
