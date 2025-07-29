import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, usePathname } from 'next/navigation';
import Header from '../Header';
import { useAuthStore } from '@/stores/authStore';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('@/stores/authStore');

jest.mock('@/components/ui/SearchBar', () => {
  return function SearchBar({ placeholder, value, onChange, className }: any) {
    return (
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        data-testid="search-bar"
      />
    );
  };
});

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
};

const mockAuthStore = {
  user: null,
  isAuthenticated: false,
  logout: jest.fn(),
};

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue('/');
    jest.mocked(useAuthStore).mockReturnValue(mockAuthStore);
  });

  describe('rendering', () => {
    it('should render logo and title', () => {
      render(<Header />);

      expect(screen.getByText('🤖')).toBeInTheDocument();
      expect(screen.getByText('Robovers')).toBeInTheDocument();
    });

    it('should render navigation items', () => {
      render(<Header />);

      expect(screen.getByText('홈')).toBeInTheDocument();
      expect(screen.getByText('로봇 정보')).toBeInTheDocument();
      expect(screen.getByText('커뮤니티')).toBeInTheDocument();
      expect(screen.getByText('기업 & 주가')).toBeInTheDocument();
    });

    it('should render search bar on desktop', () => {
      render(<Header />);

      const searchBar = screen.getByTestId('search-bar');
      expect(searchBar).toBeInTheDocument();
      expect(searchBar).toHaveAttribute('placeholder', '로봇 정보, 기사, 토론 검색...');
    });

    it('should highlight active navigation item', () => {
      (usePathname as jest.Mock).mockReturnValue('/robots');
      render(<Header />);

      const robotLink = screen.getByText('로봇 정보');
      expect(robotLink).toHaveClass('text-blue-600', 'border-b-[3px]', 'border-blue-600');
    });
  });

  describe('authentication state', () => {
    it('should show login and signup buttons when not authenticated', () => {
      render(<Header />);

      expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument();
    });

    it('should show user nickname and logout button when authenticated', () => {
      jest.mocked(useAuthStore).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        user: { nickname: 'testuser' },
      });

      render(<Header />);

      expect(screen.getByText('testuser님')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should navigate to login page when login button is clicked', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const loginButton = screen.getByRole('button', { name: '로그인' });
      await user.click(loginButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });

    it('should navigate to signup page when signup button is clicked', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const signupButton = screen.getByRole('button', { name: '회원가입' });
      await user.click(signupButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/signup');
    });

    it('should navigate to profile page when user nickname is clicked', async () => {
      const user = userEvent.setup();
      jest.mocked(useAuthStore).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        user: { nickname: 'testuser' },
      });

      render(<Header />);

      const profileButton = screen.getByText('testuser님');
      await user.click(profileButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/profile');
    });

    it('should logout and navigate to home when logout button is clicked', async () => {
      const user = userEvent.setup();
      const mockLogout = jest.fn();
      jest.mocked(useAuthStore).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        user: { nickname: 'testuser' },
        logout: mockLogout,
      });

      render(<Header />);

      const logoutButton = screen.getByRole('button', { name: '로그아웃' });
      await user.click(logoutButton);

      expect(mockLogout).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  describe('mobile menu', () => {
    it('should toggle mobile menu when menu button is clicked', async () => {
      const user = userEvent.setup();
      render(<Header />);

      // Mobile menu should not be visible initially
      expect(screen.queryByText('모바일 검색')).not.toBeInTheDocument();

      // Find and click the mobile menu button
      const menuButton = screen.getByRole('button', { name: '' });
      await user.click(menuButton);

      // Mobile menu should be visible
      await waitFor(() => {
        expect(screen.getAllByPlaceholderText('검색...').length).toBeGreaterThan(0);
      });
    });

    it('should close mobile menu when navigation item is clicked', async () => {
      const user = userEvent.setup();
      render(<Header />);

      // Open mobile menu
      const menuButton = screen.getByRole('button', { name: '' });
      await user.click(menuButton);

      // Click on a navigation item
      const communityLinks = screen.getAllByText('커뮤니티');
      const mobileLink = communityLinks.find(link => 
        link.className.includes('block')
      );

      await user.click(mobileLink!);

      // Mobile menu should be closed
      await waitFor(() => {
        const searchInputs = screen.queryAllByPlaceholderText('검색...');
        expect(searchInputs.length).toBe(0);
      });
    });

    it('should show login/signup buttons in mobile menu when not authenticated', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const menuButton = screen.getByRole('button', { name: '' });
      await user.click(menuButton);

      await waitFor(() => {
        const loginButtons = screen.getAllByRole('button', { name: '로그인' });
        const signupButtons = screen.getAllByRole('button', { name: '회원가입' });
        
        expect(loginButtons.length).toBeGreaterThan(1); // Desktop + Mobile
        expect(signupButtons.length).toBeGreaterThan(1); // Desktop + Mobile
      });
    });

    it('should show user info in mobile menu when authenticated', async () => {
      const user = userEvent.setup();
      jest.mocked(useAuthStore).mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        user: { nickname: 'testuser' },
      });

      render(<Header />);

      const menuButton = screen.getByRole('button', { name: '' });
      await user.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('testuser님 - 내 정보')).toBeInTheDocument();
        const logoutButtons = screen.getAllByRole('button', { name: '로그아웃' });
        expect(logoutButtons.length).toBeGreaterThan(1); // Desktop + Mobile
      });
    });
  });

  describe('search functionality', () => {
    it('should update search query when typing', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const searchBar = screen.getByTestId('search-bar');
      await user.type(searchBar, '휴머노이드');

      expect(searchBar).toHaveValue('휴머노이드');
    });
  });

  describe('logo navigation', () => {
    it('should navigate to home when logo is clicked', async () => {
      render(<Header />);

      const logoLink = screen.getByText('🤖').closest('a');
      expect(logoLink).toHaveAttribute('href', '/');
    });
  });
});