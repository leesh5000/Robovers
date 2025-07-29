import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePostButton from '../CreatePostButton';

describe('CreatePostButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  describe('Rendering', () => {
    it('should render both desktop and mobile buttons', () => {
      render(<CreatePostButton />);

      // Desktop button
      const desktopButton = screen.getByRole('button', { name: '새 글 작성' });
      expect(desktopButton).toBeInTheDocument();
      expect(desktopButton).toHaveClass('hidden', 'md:flex');

      // Mobile button - has aria-label instead of text
      const mobileButton = screen.getByLabelText('새 글 작성');
      expect(mobileButton).toBeInTheDocument();
      expect(mobileButton).toHaveClass('md:hidden');
    });

    it('should render desktop button with icon and text', () => {
      render(<CreatePostButton />);

      const desktopButton = screen.getByRole('button', { name: '새 글 작성' });
      expect(desktopButton).toHaveTextContent('새 글 작성');
      
      // Check for SVG icon
      const svg = desktopButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('w-5', 'h-5');
    });

    it('should render mobile button with icon only', () => {
      render(<CreatePostButton />);

      const mobileButton = screen.getByLabelText('새 글 작성');
      
      // Check for SVG icon
      const svg = mobileButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('w-6', 'h-6');
      
      // Should not contain text
      expect(mobileButton).not.toHaveTextContent('새 글 작성');
    });

    it('should apply fixed positioning for both buttons', () => {
      render(<CreatePostButton />);

      const desktopButton = screen.getByRole('button', { name: '새 글 작성' });
      expect(desktopButton).toHaveClass('fixed', 'bottom-8', 'right-8');

      const mobileButton = screen.getByLabelText('새 글 작성');
      expect(mobileButton).toHaveClass('fixed', 'bottom-6', 'right-6');
    });
  });

  describe('Styling', () => {
    it('should apply correct styles to desktop button', () => {
      render(<CreatePostButton />);

      const desktopButton = screen.getByRole('button', { name: '새 글 작성' });
      expect(desktopButton).toHaveClass(
        'items-center',
        'gap-2',
        'px-6',
        'py-3',
        'bg-blue-600',
        'text-white',
        'rounded-full',
        'shadow-lg',
        'hover:bg-blue-700',
        'hover:shadow-xl',
        'transition-all',
        'duration-200',
        'group'
      );
    });

    it('should apply correct styles to mobile button', () => {
      render(<CreatePostButton />);

      const mobileButton = screen.getByLabelText('새 글 작성');
      expect(mobileButton).toHaveClass(
        'w-14',
        'h-14',
        'bg-blue-600',
        'text-white',
        'rounded-full',
        'shadow-lg',
        'hover:bg-blue-700',
        'hover:shadow-xl',
        'transition-all',
        'duration-200',
        'flex',
        'items-center',
        'justify-center',
        'group'
      );
    });

    it('should apply rotation animation class to icons', () => {
      render(<CreatePostButton />);

      const desktopButton = screen.getByRole('button', { name: '새 글 작성' });
      const desktopIcon = desktopButton.querySelector('svg');
      expect(desktopIcon).toHaveClass('transition-transform', 'group-hover:rotate-90');

      const mobileButton = screen.getByLabelText('새 글 작성');
      const mobileIcon = mobileButton.querySelector('svg');
      expect(mobileIcon).toHaveClass('transition-transform', 'group-hover:rotate-90');
    });
  });

  describe('Interaction', () => {
    it('should show alert when desktop button is clicked', async () => {
      const user = userEvent.setup();
      render(<CreatePostButton />);

      const desktopButton = screen.getByRole('button', { name: '새 글 작성' });
      await user.click(desktopButton);

      expect(window.alert).toHaveBeenCalledWith('글쓰기 기능은 준비 중입니다!');
      expect(window.alert).toHaveBeenCalledTimes(1);
    });

    it('should show alert when mobile button is clicked', async () => {
      const user = userEvent.setup();
      render(<CreatePostButton />);

      const mobileButton = screen.getByLabelText('새 글 작성');
      await user.click(mobileButton);

      expect(window.alert).toHaveBeenCalledWith('글쓰기 기능은 준비 중입니다!');
      expect(window.alert).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple clicks', async () => {
      const user = userEvent.setup();
      render(<CreatePostButton />);

      const desktopButton = screen.getByRole('button', { name: '새 글 작성' });
      
      await user.click(desktopButton);
      await user.click(desktopButton);
      await user.click(desktopButton);

      expect(window.alert).toHaveBeenCalledTimes(3);
      expect(window.alert).toHaveBeenCalledWith('글쓰기 기능은 준비 중입니다!');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label for mobile button', () => {
      render(<CreatePostButton />);

      const mobileButton = screen.getByLabelText('새 글 작성');
      expect(mobileButton).toHaveAttribute('aria-label', '새 글 작성');
    });

    it('should have accessible text for desktop button', () => {
      render(<CreatePostButton />);

      const desktopButton = screen.getByRole('button', { name: '새 글 작성' });
      expect(desktopButton).toHaveAccessibleName('새 글 작성');
    });
  });

  describe('SVG Icons', () => {
    it('should render plus icon SVG correctly', () => {
      render(<CreatePostButton />);

      const buttons = [
        screen.getByRole('button', { name: '새 글 작성' }),
        screen.getByLabelText('새 글 작성')
      ];

      buttons.forEach(button => {
        const svg = button.querySelector('svg');
        expect(svg).toHaveAttribute('fill', 'none');
        expect(svg).toHaveAttribute('stroke', 'currentColor');
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');

        const path = svg?.querySelector('path');
        expect(path).toHaveAttribute('strokeLinecap', 'round');
        expect(path).toHaveAttribute('strokeLinejoin', 'round');
        expect(path).toHaveAttribute('strokeWidth', '2');
        expect(path).toHaveAttribute('d', 'M12 4v16m8-8H4');
      });
    });
  });

  describe('Responsive behavior', () => {
    it('should have correct responsive classes', () => {
      render(<CreatePostButton />);

      const desktopButton = screen.getByRole('button', { name: '새 글 작성' });
      const mobileButton = screen.getByLabelText('새 글 작성');

      // Desktop button hidden on mobile, shown on md and up
      expect(desktopButton).toHaveClass('hidden', 'md:flex');
      
      // Mobile button shown on mobile, hidden on md and up
      expect(mobileButton).toHaveClass('md:hidden');
    });
  });
});
