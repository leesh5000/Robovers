import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 관리자 페이지 접근 제한
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 임시로 쿠키에서 관리자 토큰 확인
    const adminToken = request.cookies.get('admin-token');
    
    // 로그인 페이지는 제외
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};