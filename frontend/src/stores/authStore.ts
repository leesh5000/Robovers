import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, AuthResponse } from '@/lib/api/auth';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl?: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingEmail: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    nickname: string;
  }) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setPendingEmail: (email: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      pendingEmail: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({ email, password });
          
          // Save tokens
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          toast.success('로그인 성공!');
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register(data);
          set({
            pendingEmail: response.email,
            isLoading: false,
          });
          toast.success('회원가입 성공! 이메일을 확인해주세요.');
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      verifyEmail: async (email: string, code: string) => {
        set({ isLoading: true });
        try {
          await authApi.verifyEmail({ email, code });
          set({
            pendingEmail: null,
            isLoading: false,
          });
          toast.success('이메일 인증 완료! 로그인해주세요.');
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      resendVerification: async (email: string) => {
        set({ isLoading: true });
        try {
          await authApi.resendVerification(email);
          set({ isLoading: false });
          toast.success('인증 이메일을 다시 보냈습니다.');
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        authApi.logout();
        set({
          user: null,
          isAuthenticated: false,
          pendingEmail: null,
        });
        toast.success('로그아웃되었습니다.');
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setPendingEmail: (email: string | null) => {
        set({ pendingEmail: email });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        pendingEmail: state.pendingEmail,
      }),
    }
  )
);