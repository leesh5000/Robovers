// 쿠키 관련 유틸리티 함수들

/**
 * 쿠키를 삭제하는 함수
 * @param name 삭제할 쿠키 이름
 */
export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};

/**
 * 쿠키를 가져오는 함수
 * @param name 가져올 쿠키 이름
 * @returns 쿠키 값 또는 null
 */
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

/**
 * 관리자 로그아웃 처리
 * - admin-token 쿠키 삭제
 * - 로그인 페이지로 리다이렉트
 */
export const logoutAdmin = () => {
  // 관리자 토큰 삭제
  deleteCookie('admin-token');
  
  // 테스트 환경에서는 리다이렉트하지 않음
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
    // 로그인 페이지로 리다이렉트
    window.location.href = '/admin/login';
  }
};

/**
 * 관리자 인증 상태 확인
 * @returns 관리자 로그인 여부
 */
export const isAdminAuthenticated = (): boolean => {
  return getCookie('admin-token') !== null;
};