import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { AppException, ErrorCode, mapHttpStatusToErrorCode, logError } from '@/lib/errors';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4010/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 처리 (토큰 만료)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
          // TODO: Implement refresh token logic
          // const response = await apiClient.post('/auth/refresh', { refreshToken });
          // Cookies.set('accessToken', response.data.accessToken, { secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
          // return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh 실패 시 로그인 페이지로 리다이렉트
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
        
        const appError = new AppException(ErrorCode.TOKEN_EXPIRED);
        logError(appError, 'API Client - Token Refresh Failed');
        return Promise.reject(appError);
      }
    }

    // 네트워크 에러 처리 (백엔드 서버 연결 실패)
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
      const appError = new AppException(
        ErrorCode.NETWORK_ERROR,
        '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요. (http://localhost:4010)',
        undefined,
        { originalError: error.message }
      );
      logError(appError, 'API Client - Connection Failed');
      toast.error('백엔드 서버에 연결할 수 없습니다.\n터미널에서 backend 폴더로 이동 후 npm run start:dev를 실행해주세요.');
      return Promise.reject(appError);
    }

    // 표준 에러 처리
    const statusCode = error.response?.status;
    const responseData = error.response?.data;
    
    // 422 에러 중 이메일 인증 에러인지 확인
    let errorCode = statusCode ? mapHttpStatusToErrorCode(statusCode) : ErrorCode.NETWORK_ERROR;
    if (statusCode === 422 && responseData?.errorCode === 'EMAIL_NOT_VERIFIED') {
      errorCode = ErrorCode.EMAIL_NOT_VERIFIED;
    }
    
    const appError = new AppException(
      errorCode,
      responseData?.message || error.message,
      statusCode,
      responseData
    );

    // 에러 로깅
    logError(appError, 'API Client');

    // 토스트 메시지 표시 (이메일 인증 에러는 AuthStore에서 처리)
    if (errorCode !== ErrorCode.UNAUTHORIZED && errorCode !== ErrorCode.EMAIL_NOT_VERIFIED) {
      toast.error(appError.message);
    }

    return Promise.reject(appError);
  }
);

export default apiClient;