import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Este middleware verifica se o usuário está autenticado antes de acessar rotas protegidas.
export function middleware(request: NextRequest) {
  // Obtém o token do cookie
  const token = request.cookies.get('auth_token')?.value

  // Se o usuário está tentando acessar o dashboard sem um token,
  // redireciona para a página de login.
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('Middleware: Usuário não autenticado tentando acessar /dashboard. Redirecionando para /login.');
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Se o usuário está autenticado e tenta acessar as páginas de login ou registro,
  // redireciona para o dashboard.
  if (token && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register'))) {
    console.log('Middleware: Usuário autenticado tentando acessar /login ou /register. Redirecionando para /dashboard.');
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // Se nenhuma das condições acima for atendida, permite que a requisição continue.
  return NextResponse.next()
}

// O 'matcher' define as rotas em que este middleware será executado.
export const config = {
  matcher: [
    /*
     * Corresponde a todas as rotas, exceto:
     * - /api/: rotas da API
     * - /_next/static: arquivos estáticos
     * - /_next/image: arquivos de otimização de imagem
     * - /favicon.ico: ícone do site
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 