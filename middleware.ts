import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // Логин будет 'admin', а пароль возьмется из Vercel
    if (user === 'admin' && pwd === process.env.SITE_PASSWORD) {
      return NextResponse.next();
    }
  }

  url.pathname = '/api/auth';
  return new NextResponse('Требуется авторизация', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
