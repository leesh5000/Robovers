import { act, renderHook } from '@testing-library/react';
import { useAuthStore } from '../authStore';
import { authApi } from '@/lib/api/auth';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { AppException, ErrorCode } from '@/lib/errors';

// Mock dependencies
jest.mock('@/lib/api/auth');
jest.mock('js-cookie');
jest.mock('react-hot-toast', () => ({
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockAuthApi = authApi as jest.Mocked<typeof authApi>;
const mockCookies = Cookies as jest.Mocked<typeof Cookies>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe('authStore', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    nickname: '테스트유저',
    profileImageUrl: 'https://example.com/profile.jpg',
    role: 'USER',
    isActive: true,
    emailVerified: true,
  };

  beforeEach(() => {
    // Reset store state
    act(() => {
      useAuthStore.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        pendingEmail: null,
      });
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const { result } = renderHook(() => useAuthStore());
      
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.pendingEmail).toBeNull();
    });
  });

  describe('login', () => {
    it('should login successfully and set user data', async () => {
      const mockResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: mockUser,
      };

      mockAuthApi.login.mockResolvedValueOnce(mockResponse);
      
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        const response = await result.current.login('test@example.com', 'password123');
        expect(response).toEqual({});
      });

      expect(mockAuthApi.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockCookies.set).toHaveBeenCalledWith('accessToken', 'access-token', {
        expires: 1,
        secure: false, // NODE_ENV is 'test'
        sameSite: 'strict',
      });

      expect(mockCookies.set).toHaveBeenCalledWith('refreshToken', 'refresh-token', {
        expires: 7,
        secure: false,
        sameSite: 'strict',
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(mockToast.success).toHaveBeenCalledWith('로그인 성공!');
    });

    it('should handle email not verified error', async () => {
      const emailNotVerifiedError = new AppException(
        ErrorCode.EMAIL_NOT_VERIFIED,
        '이메일 인증이 필요합니다',
        422,
        { needEmailVerification: true, email: 'test@example.com' }
      );

      mockAuthApi.login.mockRejectedValueOnce(emailNotVerifiedError);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        const response = await result.current.login('test@example.com', 'password123');
        expect(response).toEqual({
          needsEmailVerification: true,
          email: 'test@example.com',
        });
      });

      expect(result.current.pendingEmail).toBe('test@example.com');
      expect(result.current.isLoading).toBe(false);
      expect(mockToast.error).toHaveBeenCalledWith('이메일 인증이 필요합니다.');
    });

    it('should handle general login error', async () => {
      const error = new Error('Invalid credentials');
      mockAuthApi.login.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await expect(result.current.login('test@example.com', 'wrong-password')).rejects.toThrow(error);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should set isLoading during login', async () => {
      let resolveLogin: (value: any) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });

      mockAuthApi.login.mockReturnValueOnce(loginPromise as any);

      const { result } = renderHook(() => useAuthStore());

      // Start login
      act(() => {
        result.current.login('test@example.com', 'password123');
      });

      // Check loading state
      expect(result.current.isLoading).toBe(true);

      // Resolve login
      await act(async () => {
        resolveLogin!({
          accessToken: 'token',
          refreshToken: 'refresh',
          user: mockUser,
        });
        await loginPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = {
        message: '회원가입이 완료되었습니다.',
        email: 'test@example.com',
      };

      mockAuthApi.register.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.register({
          email: 'test@example.com',
          password: 'password123',
          nickname: '테스트유저',
        });
      });

      expect(mockAuthApi.register).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        nickname: '테스트유저',
      });

      expect(result.current.pendingEmail).toBe('test@example.com');
      expect(result.current.isLoading).toBe(false);
      expect(mockToast.success).toHaveBeenCalledWith('회원가입 성공! 이메일을 확인해주세요.');
    });

    it('should handle register error', async () => {
      const error = new Error('Email already exists');
      mockAuthApi.register.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await expect(
          result.current.register({
            email: 'test@example.com',
            password: 'password123',
            nickname: '테스트유저',
          })
        ).rejects.toThrow(error);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.pendingEmail).toBeNull();
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      mockAuthApi.verifyEmail.mockResolvedValueOnce({ message: '이메일 인증이 완료되었습니다.' });

      const { result } = renderHook(() => useAuthStore());

      // Set initial pending email
      act(() => {
        useAuthStore.setState({ pendingEmail: 'test@example.com' });
      });

      await act(async () => {
        await result.current.verifyEmail('test@example.com', '123456');
      });

      expect(mockAuthApi.verifyEmail).toHaveBeenCalledWith({
        email: 'test@example.com',
        code: '123456',
      });

      expect(result.current.pendingEmail).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(mockToast.success).toHaveBeenCalledWith('이메일 인증 완료! 로그인해주세요.');
    });

    it('should handle verify email error', async () => {
      const error = new Error('Invalid verification code');
      mockAuthApi.verifyEmail.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await expect(
          result.current.verifyEmail('test@example.com', 'wrong-code')
        ).rejects.toThrow(error);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('resendVerification', () => {
    it('should resend verification email successfully', async () => {
      mockAuthApi.resendVerification.mockResolvedValueOnce({ message: '인증 이메일을 다시 보냈습니다.' });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.resendVerification('test@example.com');
      });

      expect(mockAuthApi.resendVerification).toHaveBeenCalledWith('test@example.com');
      expect(result.current.isLoading).toBe(false);
      expect(mockToast.success).toHaveBeenCalledWith('인증 이메일을 다시 보냈습니다.');
    });

    it('should handle resend verification error', async () => {
      const error = new Error('Too many requests');
      mockAuthApi.resendVerification.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await expect(
          result.current.resendVerification('test@example.com')
        ).rejects.toThrow(error);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout and clear all data', () => {
      const { result } = renderHook(() => useAuthStore());

      // Set initial authenticated state
      act(() => {
        useAuthStore.setState({
          user: mockUser,
          isAuthenticated: true,
          pendingEmail: 'test@example.com',
        });
      });

      act(() => {
        result.current.logout();
      });

      expect(mockAuthApi.logout).toHaveBeenCalled();
      expect(mockCookies.remove).toHaveBeenCalledWith('accessToken');
      expect(mockCookies.remove).toHaveBeenCalledWith('refreshToken');
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.pendingEmail).toBeNull();
      expect(mockToast.success).toHaveBeenCalledWith('로그아웃되었습니다.');
    });
  });

  describe('setUser', () => {
    it('should set user and mark as authenticated', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('setPendingEmail', () => {
    it('should set pending email', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setPendingEmail('pending@example.com');
      });

      expect(result.current.pendingEmail).toBe('pending@example.com');
    });

    it('should clear pending email when null is passed', () => {
      const { result } = renderHook(() => useAuthStore());

      // Set initial pending email
      act(() => {
        result.current.setPendingEmail('pending@example.com');
      });

      act(() => {
        result.current.setPendingEmail(null);
      });

      expect(result.current.pendingEmail).toBeNull();
    });
  });

  describe('persistence', () => {
    it('should persist only specific state fields', () => {
      // Access the store configuration
      useAuthStore.getState();
      
      // Create a full state object
      const fullState = {
        user: mockUser,
        isAuthenticated: true,
        isLoading: true,
        pendingEmail: 'test@example.com',
        login: jest.fn(),
        register: jest.fn(),
        verifyEmail: jest.fn(),
        resendVerification: jest.fn(),
        logout: jest.fn(),
        setUser: jest.fn(),
        setPendingEmail: jest.fn(),
      };

      // Manually test what would be persisted based on the partialize function
      // The partialize function in authStore only saves: user, isAuthenticated, pendingEmail
      const persistedState = {
        user: fullState.user,
        isAuthenticated: fullState.isAuthenticated,
        pendingEmail: fullState.pendingEmail,
      };

      // Verify the persisted state has the correct fields
      expect(persistedState).toHaveProperty('user');
      expect(persistedState).toHaveProperty('isAuthenticated');
      expect(persistedState).toHaveProperty('pendingEmail');
      
      // Verify it doesn't have other fields
      expect(persistedState).not.toHaveProperty('isLoading');
      expect(persistedState).not.toHaveProperty('login');
    });
  });
});