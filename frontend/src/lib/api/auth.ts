import apiClient from './client';

export interface RegisterData {
  email: string;
  password: string;
  nickname: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    nickname: string;
    profileImageUrl?: string;
    role: string;
    isActive: boolean;
    emailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await apiClient.post<{ message: string; email: string }>(
      '/auth/register',
      data
    );
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailData) => {
    const response = await apiClient.post<{ message: string }>(
      '/auth/verify-email',
      data
    );
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await apiClient.post<{ message: string }>(
      '/auth/resend-verification',
      { email }
    );
    return response.data;
  },

  logout: async () => {
    // Clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // You might want to call a logout endpoint here if needed
  },
};