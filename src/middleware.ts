import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Remova o withAuth daqui

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuth = !!token;
  const isAuthPage = pathname.startsWith("/login");
  const isAdminPage = pathname.startsWith("/admin");

  // Se o usuário já logado tentar acessar a página de login, redirecione-o
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Se o usuário não logado tentar acessar uma página de admin, redirecione-o
  if (isAdminPage && !isAuth) {
    let from = pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  // Permite todas as outras requisições
  return NextResponse.next();
}

// O matcher agora precisa incluir a página de login para a lógica funcionar lá
export const config = {
  matcher: ["/admin/:path*", "/login"],
};
