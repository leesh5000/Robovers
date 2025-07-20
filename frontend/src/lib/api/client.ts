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

    // 표준 에러 처리
    const statusCode = error.response?.status;
    const errorCode = statusCode ? mapHttpStatusToErrorCode(statusCode) : ErrorCode.NETWORK_ERROR;
    
    const appError = new AppException(
      errorCode,
      error.response?.data?.message || error.message,
      statusCode,
      error.response?.data
    );

    // 에러 로깅
    logError(appError, 'API Client');

    // 토스트 메시지 표시 (사용자 친화적 메시지)
    if (errorCode !== ErrorCode.UNAUTHORIZED) { // 401은 자동 리다이렉트되므로 토스트 표시 안함
      toast.error(appError.message);
    }

    return Promise.reject(appError);
  }
);

export default apiClient;