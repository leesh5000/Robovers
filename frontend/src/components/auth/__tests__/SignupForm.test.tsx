import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import SignupForm from '../SignupForm';
import { useAuthStore } from '@/stores/authStore';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/stores/authStore');

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
};

const mockRegister = jest.fn();
const mockAuthStore = {
  register: mockRegister,
  isLoading: false,
};

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter as any);
    mockUseAuthStore.mockReturnValue(mockAuthStore as any);
  });

  describe('rendering', () => {
    it('should render all form fields', () => {
      render(<SignupForm />);

      expect(screen.getByLabelText(/닉네임/)).toBeInTheDocument();
      expect(screen.getByLabelText(/이메일/)).toBeInTheDocument();
      expect(screen.getByLabelText(/^비밀번호$/)).toBeInTheDocument();
      expect(screen.getByLabelText(/비밀번호 확인/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument();
    });

    it('should render required field indicators', () => {
      render(<SignupForm />);

      const requiredIndicators = screen.getAllByText('*');
      expect(requiredIndicators).toHaveLength(4); // All fields are required
    });

    it('should render password visibility toggle button', () => {
      render(<SignupForm />);

      const toggleButtons = screen.getAllByRole('button', { name: '' }).filter(
        button => (button as HTMLButtonElement).type === 'button'
      );
      expect(toggleButtons).toHaveLength(1);
    });
  });

  describe('form validation', () => {
    it('should show error when nickname is too short', async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const nicknameInput = screen.getByLabelText(/닉네임/);
      await user.type(nicknameInput, 'a');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('닉네임은 2자 이상이어야 합니다')).toBeInTheDocument();
      });
    });

    it('should show error when nickname is too long', async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const nicknameInput = screen.getByLabelText(/닉네임/);
      await user.type(nicknameInput, 'a'.repeat(21));
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('닉네임은 20자 이하여야 합니다')).toBeInTheDocument();
      });
    });

    it('should show error when nickname contains invalid characters', async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const nicknameInput = screen.getByLabelText(/닉네임/);
      await user.type(nicknameInput, '테스트!');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('닉네임은 영문, 숫자, 언더스코어(_), 하이픈(-)만 사용 가능합니다')).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const emailInput = screen.getByLabelText(/이메일/);
      await user.type(emailInput, 'invalid-email');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('올바른 이메일 형식이 아닙니다')).toBeInTheDocument();
      });
    });

    it('should show error when password is too short', async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const passwordInput = screen.getByLabelText(/^비밀번호$/);
      await user.type(passwordInput, 'Pass1!');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('비밀번호는 8자 이상이어야 합니다')).toBeInTheDocument();
      });
    });

    it('should show error when password lacks required characters', async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const passwordInput = screen.getByLabelText(/^비밀번호$/);
      await user.type(passwordInput, 'password123'); // Missing uppercase and special char
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다')).toBeInTheDocument();
      });
    });

    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const passwordInput = screen.getByLabelText(/^비밀번호$/);
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/);

      await user.type(passwordInput, 'Password123!');
      await user.type(confirmPasswordInput, 'Password456!');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('비밀번호가 일치하지 않습니다')).toBeInTheDocument();
      });
    });

    it('should show required field errors when submitting empty form', async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const submitButton = screen.getByRole('button', { name: '회원가입' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('닉네임을 입력해주세요')).toBeInTheDocument();
        expect(screen.getByText('이메일을 입력해주세요')).toBeInTheDocument();
        expect(screen.getByText('비밀번호를 입력해주세요')).toBeInTheDocument();
        expect(screen.getByText('비밀번호 확인을 입력해주세요')).toBeInTheDocument();
      });
    });
  });

  describe('password visibility toggle', () => {
    it('should toggle password visibility when clicking eye icon', async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const passwordInput = screen.getByLabelText(/^비밀번호$/);
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/);
      const toggleButton = screen.getAllByRole('button', { name: '' }).find(
        button => (button as HTMLButtonElement).type === 'button'
      );

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');

      await user.click(toggleButton!);

      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(confirmPasswordInput).toHaveAttribute('type', 'text');

      await user.click(toggleButton!);

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('form submission', () => {
    it('should call register and redirect on successful signup', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValueOnce(undefined);

      render(<SignupForm />);

      const nicknameInput = screen.getByLabelText(/닉네임/);
      const emailInput = screen.getByLabelText(/이메일/);
      const passwordInput = screen.getByLabelText(/^비밀번호$/);
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/);
      const submitButton = screen.getByRole('button', { name: '회원가입' });

      await user.type(nicknameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123!');
      await user.type(confirmPasswordInput, 'Password123!');

      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'Password123!',
          nickname: 'testuser',
        });
        expect(mockRouter.push).toHaveBeenCalledWith('/signup/verify');
      });
    });

    it('should handle signup error gracefully', async () => {
      const user = userEvent.setup();
      const error = new Error('Signup failed');
      mockRegister.mockRejectedValueOnce(error);

      render(<SignupForm />);

      const nicknameInput = screen.getByLabelText(/닉네임/);
      const emailInput = screen.getByLabelText(/이메일/);
      const passwordInput = screen.getByLabelText(/^비밀번호$/);
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/);
      const submitButton = screen.getByRole('button', { name: '회원가입' });

      await user.type(nicknameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123!');
      await user.type(confirmPasswordInput, 'Password123!');

      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalled();
        expect(mockRouter.push).not.toHaveBeenCalled();
      });
    });

    it('should disable submit button when loading', () => {
      mockUseAuthStore.mockReturnValue({
        ...mockAuthStore,
        isLoading: true,
      } as any);

      render(<SignupForm />);

      const submitButton = screen.getByRole('button', { name: '처리 중...' });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('password strength indicator', () => {
    it('should show password strength indicator when password is entered', async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const passwordInput = screen.getByLabelText(/^비밀번호$/);
      
      // Initially, no password strength indicator
      expect(screen.queryByText(/보안 수준:/)).not.toBeInTheDocument();

      await user.type(passwordInput, 'Password123!');

      // Password strength indicator should be visible
      await waitFor(() => {
        expect(screen.getByText(/보안 수준:/)).toBeInTheDocument();
      });
    });
  });

  describe('field hints', () => {
    it('should show nickname field hint', () => {
      render(<SignupForm />);

      expect(screen.getByText('영문, 숫자, 언더스코어(_), 하이픈(-)을 사용하여 2-20자로 입력해주세요')).toBeInTheDocument();
    });
  });
});