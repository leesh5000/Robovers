import { authApi } from '../auth';

// Mock the apiClient module
jest.mock('../client', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), handlers: [] },
      response: { use: jest.fn(), handlers: [] }
    }
  }
}));

// Import after mock
import apiClient from '../client';

// Mock localStorage
const localStorageMock = {
  removeItem: jest.fn(),
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0,
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('authApi', () => {
  const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerData = {
        email: 'test@example.com',
        password: 'password123',
        nickname: '테스트유저',
      };

      const mockResponse = {
        data: {
          message: '회원가입이 완료되었습니다',
          email: 'test@example.com',
        },
      };

      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await authApi.register(registerData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/register', registerData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle register error', async () => {
      const registerData = {
        email: 'test@example.com',
        password: 'password123',
        nickname: '테스트유저',
      };

      const error = new Error('Registration failed');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(authApi.register(registerData)).rejects.toThrow(error);
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/register', registerData);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            nickname: '테스트유저',
            profileImageUrl: 'https://example.com/profile.jpg',
            role: 'USER',
            isActive: true,
            emailVerified: true,
          },
          accessToken: 'access-token-123',
          refreshToken: 'refresh-token-123',
        },
      };

      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await authApi.login(loginData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', loginData);
      expect(result).toEqual(mockResponse.data);
      expect(result.user.id).toBe('1');
      expect(result.accessToken).toBe('access-token-123');
      expect(result.refreshToken).toBe('refresh-token-123');
    });

    it('should handle login error', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      const error = new Error('Invalid credentials');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(authApi.login(loginData)).rejects.toThrow(error);
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', loginData);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const verifyData = {
        email: 'test@example.com',
        code: '123456',
      };

      const mockResponse = {
        data: {
          message: '이메일 인증이 완료되었습니다',
        },
      };

      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await authApi.verifyEmail(verifyData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/verify-email', verifyData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle verify email error', async () => {
      const verifyData = {
        email: 'test@example.com',
        code: 'wrong-code',
      };

      const error = new Error('Invalid verification code');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(authApi.verifyEmail(verifyData)).rejects.toThrow(error);
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/verify-email', verifyData);
    });
  });

  describe('resendVerification', () => {
    it('should resend verification email successfully', async () => {
      const email = 'test@example.com';

      const mockResponse = {
        data: {
          message: '인증 이메일을 다시 보냈습니다',
        },
      };

      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await authApi.resendVerification(email);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/resend-verification', { email });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle resend verification error', async () => {
      const email = 'test@example.com';

      const error = new Error('Too many requests');
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(authApi.resendVerification(email)).rejects.toThrow(error);
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/resend-verification', { email });
    });
  });

  describe('logout', () => {
    it('should clear tokens from localStorage', async () => {
      await authApi.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(2);
    });

    it('should not call any API endpoint', async () => {
      await authApi.logout();

      expect(mockApiClient.post).not.toHaveBeenCalled();
    });
  });

  describe('type safety', () => {
    it('should have correct types for register response', async () => {
      const registerData = {
        email: 'test@example.com',
        password: 'password123',
        nickname: '테스트유저',
      };

      const mockResponse = {
        data: {
          message: '회원가입이 완료되었습니다',
          email: 'test@example.com',
        },
      };

      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await authApi.register(registerData);

      // TypeScript should enforce these properties exist
      expect(result.message).toBeDefined();
      expect(result.email).toBeDefined();
    });

    it('should have correct types for login response', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            nickname: '테스트유저',
            role: 'USER',
            isActive: true,
            emailVerified: true,
          },
          accessToken: 'token',
          refreshToken: 'refresh',
        },
      };

      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await authApi.login(loginData);

      // TypeScript should enforce these properties exist
      expect(result.user).toBeDefined();
      expect(result.user.id).toBeDefined();
      expect(result.user.email).toBeDefined();
      expect(result.user.nickname).toBeDefined();
      expect(result.user.role).toBeDefined();
      expect(result.user.isActive).toBeDefined();
      expect(result.user.emailVerified).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });
});