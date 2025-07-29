import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import LoginForm from '../LoginForm';
import { useAuthStore } from '@/stores/authStore';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(),
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('LoginForm', () => {
  const mockPush = jest.fn();
  const mockLogin = jest.fn();
  
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });

    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: false,
    });

    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render login form with all fields', () => {
      render(<LoginForm />);

      expect(screen.getByLabelText('이메일')).toBeInTheDocument();
      expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
      expect(screen.getByLabelText('로그인 상태 유지')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
      expect(screen.getByText('비밀번호를 잊으셨나요?')).toBeInTheDocument();
    });

    it('should show loading state when isLoading is true', () => {
      mockUseAuthStore.mockReturnValue({
        login: mockLogin,
        isLoading: true,
      });

      render(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: '처리 중...' });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('form validation', () => {
    it('should show error when email is empty', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: '로그인' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('이메일을 입력해주세요')).toBeInTheDocument();
      });
    });

    it('should show error when email format is invalid', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByLabelText('이메일');
      await user.type(emailInput, 'invalid-email');
      
      const submitButton = screen.getByRole('button', { name: '로그인' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('올바른 이메일 형식이 아닙니다')).toBeInTheDocument();
      });
    });

    it('should show error when password is empty', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByLabelText('이메일');
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: '로그인' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('비밀번호를 입력해주세요')).toBeInTheDocument();
      });
    });
  });

  describe('password visibility toggle', () => {
    it('should toggle password visibility when button is clicked', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const passwordInput = screen.getByLabelText('비밀번호');
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Find the toggle button (it's within the password field container)
      const toggleButton = passwordInput.parentElement?.querySelector('button[type="button"]');
      expect(toggleButton).toBeTruthy();

      await user.click(toggleButton!);
      expect(passwordInput).toHaveAttribute('type', 'text');

      await user.click(toggleButton!);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('form submission', () => {
    it('should call login and redirect on successful login', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValueOnce({});

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const submitButton = screen.getByRole('button', { name: '로그인' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should redirect to verification page when email verification is needed', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValueOnce({
        needsEmailVerification: true,
        email: 'test@example.com',
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const submitButton = screen.getByRole('button', { name: '로그인' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockPush).toHaveBeenCalledWith('/signup/verify');
        expect(mockPush).not.toHaveBeenCalledWith('/');
      });
    });

    it('should handle login error gracefully', async () => {
      const user = userEvent.setup();
      const error = new Error('Invalid credentials');
      mockLogin.mockRejectedValueOnce(error);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const submitButton = screen.getByRole('button', { name: '로그인' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrong-password');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'wrong-password');
        expect(mockPush).not.toHaveBeenCalled();
      });
    });

    it('should disable submit button during loading', async () => {
      const user = userEvent.setup();
      
      // Create a promise that we can control
      let resolveLogin: () => void;
      const loginPromise = new Promise<void>((resolve) => {
        resolveLogin = resolve;
      });
      mockLogin.mockReturnValueOnce(loginPromise);

      // Re-render with loading state
      const { rerender } = render(<LoginForm />);

      const emailInput = screen.getByLabelText('이메일');
      const passwordInput = screen.getByLabelText('비밀번호');
      const submitButton = screen.getByRole('button', { name: '로그인' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      // Start form submission
      await user.click(submitButton);

      // Update loading state
      mockUseAuthStore.mockReturnValue({
        login: mockLogin,
        isLoading: true,
      });
      
      rerender(<LoginForm />);

      const loadingButton = screen.getByRole('button', { name: '처리 중...' });
      expect(loadingButton).toBeDisabled();

      // Resolve the login promise
      resolveLogin!();
      await loginPromise;
    });
  });

  describe('navigation links', () => {
    it('should have forgot password link', () => {
      render(<LoginForm />);

      const forgotPasswordLink = screen.getByText('비밀번호를 잊으셨나요?');
      expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
    });
  });

  describe('remember me checkbox', () => {
    it('should have remember me checkbox', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const rememberMeCheckbox = screen.getByLabelText('로그인 상태 유지');
      expect(rememberMeCheckbox).not.toBeChecked();

      await user.click(rememberMeCheckbox);
      expect(rememberMeCheckbox).toBeChecked();
    });
  });
});