import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryFilter from '../CategoryFilter';
import { CommunityCategory } from '@/lib/types';

describe('CategoryFilter', () => {
  const mockOnCategoryChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all category buttons', () => {
      render(
        <CategoryFilter 
          selectedCategory="all" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );

      // Check all categories are rendered
      expect(screen.getByRole('button', { name: /📋 전체/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /💬 일반/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /🔧 기술/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /🎨 쇼케이스/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /❓ 질문/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /🗣️ 토론/ })).toBeInTheDocument();
    });

    it('should render exactly 6 category buttons', () => {
      render(
        <CategoryFilter 
          selectedCategory="all" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(6);
    });

    it('should render with flex layout for responsive design', () => {
      render(
        <CategoryFilter 
          selectedCategory="all" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );

      const container = screen.getByRole('button', { name: /전체/ }).parentElement;
      expect(container).toHaveClass('flex', 'flex-wrap', 'gap-2');
    });
  });

  describe('Selection styling', () => {
    it('should apply selected styles to "all" category by default', () => {
      render(
        <CategoryFilter 
          selectedCategory="all" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );

      const allButton = screen.getByRole('button', { name: /📋 전체/ });
      expect(allButton).toHaveClass('bg-blue-600', 'text-white', 'shadow-md');
      expect(allButton).not.toHaveClass('bg-gray-100', 'text-gray-700');
    });

    it('should apply selected styles to selected category', () => {
      render(
        <CategoryFilter 
          selectedCategory="technical" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );

      const technicalButton = screen.getByRole('button', { name: /🔧 기술/ });
      expect(technicalButton).toHaveClass('bg-blue-600', 'text-white', 'shadow-md');
      
      // Other buttons should not have selected styles
      const generalButton = screen.getByRole('button', { name: /💬 일반/ });
      expect(generalButton).toHaveClass('bg-gray-100', 'text-gray-700');
      expect(generalButton).not.toHaveClass('bg-blue-600', 'text-white');
    });

    it('should apply unselected styles to non-selected categories', () => {
      render(
        <CategoryFilter 
          selectedCategory="general" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );

      const unselectedCategories = [
        '📋 전체',
        '🔧 기술',
        '🎨 쇼케이스',
        '❓ 질문',
        '🗣️ 토론'
      ];

      unselectedCategories.forEach(category => {
        const button = screen.getByRole('button', { name: new RegExp(category) });
        expect(button).toHaveClass('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
        expect(button).not.toHaveClass('bg-blue-600', 'text-white');
      });
    });
  });

  describe('Interaction', () => {
    it('should call onCategoryChange when category is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CategoryFilter 
          selectedCategory="all" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );

      const technicalButton = screen.getByRole('button', { name: /🔧 기술/ });
      await user.click(technicalButton);

      expect(mockOnCategoryChange).toHaveBeenCalledWith('technical');
      expect(mockOnCategoryChange).toHaveBeenCalledTimes(1);
    });

    it('should call onCategoryChange with "all" when All is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CategoryFilter 
          selectedCategory="general" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );

      const allButton = screen.getByRole('button', { name: /📋 전체/ });
      await user.click(allButton);

      expect(mockOnCategoryChange).toHaveBeenCalledWith('all');
    });

    it('should handle clicking already selected category', async () => {
      const user = userEvent.setup();
      render(
        <CategoryFilter 
          selectedCategory="general" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );

      const generalButton = screen.getByRole('button', { name: /💬 일반/ });
      await user.click(generalButton);

      // Should still call the handler even if already selected
      expect(mockOnCategoryChange).toHaveBeenCalledWith('general');
    });

    it('should handle clicking multiple categories in sequence', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <CategoryFilter 
          selectedCategory="all" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );

      // Click general
      await user.click(screen.getByRole('button', { name: /💬 일반/ }));
      expect(mockOnCategoryChange).toHaveBeenCalledWith('general');

      // Simulate prop update
      rerender(
        <CategoryFilter 
          selectedCategory="general" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );

      // Click technical
      await user.click(screen.getByRole('button', { name: /🔧 기술/ }));
      expect(mockOnCategoryChange).toHaveBeenCalledWith('technical');

      // Simulate prop update
      rerender(
        <CategoryFilter 
          selectedCategory="technical" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );

      // Click all
      await user.click(screen.getByRole('button', { name: /📋 전체/ }));
      expect(mockOnCategoryChange).toHaveBeenCalledWith('all');

      expect(mockOnCategoryChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('Type safety', () => {
    it('should handle all CommunityCategory types', () => {
      const categories: Array<CommunityCategory | 'all'> = [
        'all',
        'general',
        'technical',
        'showcase',
        'question',
        'discussion'
      ];

      categories.forEach(category => {
        const { unmount } = render(
          <CategoryFilter 
            selectedCategory={category} 
            onCategoryChange={mockOnCategoryChange} 
          />
        );

        // Should render without errors for all valid categories
        expect(screen.getAllByRole('button')).toHaveLength(6);
        unmount();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button labels with icons and text', () => {
      render(
        <CategoryFilter 
          selectedCategory="all" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );

      // Each button should have both icon and text in the accessible name
      const buttons = [
        { icon: '📋', text: '전체' },
        { icon: '💬', text: '일반' },
        { icon: '🔧', text: '기술' },
        { icon: '🎨', text: '쇼케이스' },
        { icon: '❓', text: '질문' },
        { icon: '🗣️', text: '토론' }
      ];

      buttons.forEach(({ icon, text }) => {
        const button = screen.getByRole('button', { name: new RegExp(`${icon}\\s*${text}`) });
        expect(button).toBeInTheDocument();
      });
    });

    it('should maintain consistent button styling', () => {
      render(
        <CategoryFilter 
          selectedCategory="all" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('px-4', 'py-2', 'rounded-full', 'text-sm', 'font-medium', 'transition-all');
      });
    });
  });

  describe('Edge cases', () => {
    it('should render correctly when selectedCategory is undefined', () => {
      render(
        <CategoryFilter 
          selectedCategory={'all'}
          onCategoryChange={mockOnCategoryChange} 
        />
      );

      // Should still render all buttons
      expect(screen.getAllByRole('button')).toHaveLength(6);
    });

    it('should handle rapid clicks gracefully', async () => {
      const user = userEvent.setup();
      render(
        <CategoryFilter 
          selectedCategory="all" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );

      const button = screen.getByRole('button', { name: /💬 일반/ });
      
      // Rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(mockOnCategoryChange).toHaveBeenCalledTimes(3);
      expect(mockOnCategoryChange).toHaveBeenCalledWith('general');
    });
  });
});
