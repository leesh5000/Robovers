import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should not render when totalPages is 1 or less', () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={mockOnPageChange}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render pagination controls when totalPages > 1', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByRole('button', { name: '이전' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
          className="custom-pagination"
        />
      );

      expect(screen.getByRole('navigation')).toHaveClass('custom-pagination');
    });
  });

  describe('page numbers display', () => {
    it('should show all pages when totalPages is small', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should show dots when there are many pages', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
    });

    it('should show dots on both sides when current page is in the middle', () => {
      render(
        <Pagination
          currentPage={6}
          totalPages={12}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getAllByText('...')).toHaveLength(2);
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('should handle edge case with specific page ranges', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={6}
          onPageChange={mockOnPageChange}
        />
      );

      // Should show pages without dots when gap is only 1
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });
  });

  describe('navigation buttons', () => {
    it('should disable previous button on first page', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByRole('button', { name: '이전' });
      expect(prevButton).toBeDisabled();
      expect(prevButton).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should disable next button on last page', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByRole('button', { name: '다음' });
      expect(nextButton).toBeDisabled();
      expect(nextButton).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should enable both buttons when on middle page', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByRole('button', { name: '이전' });
      const nextButton = screen.getByRole('button', { name: '다음' });
      
      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('page changes', () => {
    it('should call onPageChange when clicking page number', async () => {
      const user = userEvent.setup();
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      await user.click(screen.getByText('3'));
      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });

    it('should call onPageChange when clicking previous button', async () => {
      const user = userEvent.setup();
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      await user.click(screen.getByRole('button', { name: '이전' }));
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('should call onPageChange when clicking next button', async () => {
      const user = userEvent.setup();
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      await user.click(screen.getByRole('button', { name: '다음' }));
      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    it('should not call onPageChange when clicking current page', async () => {
      const user = userEvent.setup();
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      await user.click(screen.getByText('3'));
      expect(mockOnPageChange).not.toHaveBeenCalled();
    });

    it('should not call onPageChange when clicking dots', async () => {
      const user = userEvent.setup();
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      const dots = screen.getByText('...');
      await user.click(dots);
      expect(mockOnPageChange).not.toHaveBeenCalled();
    });
  });

  describe('current page highlighting', () => {
    it('should highlight current page', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const currentPageButton = screen.getByText('3').parentElement;
      expect(currentPageButton).toHaveClass('bg-blue-600', 'text-white');
      expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    });

    it('should not highlight other pages', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const otherPageButton = screen.getByText('2').parentElement;
      expect(otherPageButton).not.toHaveClass('bg-blue-600', 'text-white');
      expect(otherPageButton).toHaveClass('hover:bg-gray-50');
    });
  });

  describe('accessibility', () => {
    it('should have navigation role', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should have aria-label for navigation buttons', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByRole('button', { name: '이전' })).toHaveAttribute('aria-label', '이전 페이지로');
      expect(screen.getByRole('button', { name: '다음' })).toHaveAttribute('aria-label', '다음 페이지로');
    });

    it('should have aria-label for page buttons', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const page3Button = screen.getByText('3').parentElement;
      expect(page3Button).toHaveAttribute('aria-label', '3 페이지로 이동');
    });
  });

  describe('edge cases', () => {
    it('should handle totalPages of 2', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={2}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });

    it('should handle large page numbers', () => {
      render(
        <Pagination
          currentPage={50}
          totalPages={100}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('48')).toBeInTheDocument();
      expect(screen.getByText('49')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('51')).toBeInTheDocument();
      expect(screen.getByText('52')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getAllByText('...')).toHaveLength(2);
    });

    it('should handle currentPage at the beginning', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
    });

    it('should handle currentPage at the end', () => {
      render(
        <Pagination
          currentPage={9}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('9')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
    });
  });
});