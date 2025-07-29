import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  const defaultProps = {
    placeholder: 'Search...',
    value: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render with default variant', () => {
      render(<SearchBar {...defaultProps} />);

      const container = screen.getByRole('search');
      expect(container).toHaveClass('relative', 'flex', 'items-center');
      
      const input = screen.getByPlaceholderText('Search...');
      expect(input).toBeInTheDocument();
    });

    it('should render with icon-inside variant', () => {
      render(<SearchBar {...defaultProps} />);

      const input = screen.getByPlaceholderText('Search...');
      expect(input).toHaveClass('pl-10'); // Padding for icon
    });

    it('should render with icon-outside variant', () => {
      render(<SearchBar {...defaultProps} variant="icon-outside" />);

      const button = screen.getByRole('button', { name: 'Search' });
      expect(button).toBeInTheDocument();
    });

    it('should render with minimal variant', () => {
      render(<SearchBar {...defaultProps} />);

      const input = screen.getByPlaceholderText('Search...');
      expect(input).toHaveClass('bg-transparent', 'border-0');
    });

    it('should apply custom className', () => {
      render(<SearchBar {...defaultProps} className="custom-class" />);

      const container = screen.getByRole('search');
      expect(container).toHaveClass('custom-class');
    });

    it('should apply custom size classes', () => {
      render(<SearchBar {...defaultProps} />);

      const input = screen.getByPlaceholderText('Search...');
      expect(input).toHaveClass('text-sm', 'py-1.5');
    });

    it('should show loading state', () => {
      render(<SearchBar {...defaultProps} />);

      // Check for loading spinner animation
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('should call onChange when typing', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<SearchBar {...defaultProps} onChange={onChange} />);

      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, 'test query');

      expect(onChange).toHaveBeenCalledTimes(10); // Once for each character
      expect(onChange).toHaveBeenLastCalledWith('test query');
    });

    it('should show clear button when there is value', () => {
      render(<SearchBar {...defaultProps} value="test" />);

      const clearButton = screen.getByRole('button', { name: 'Clear search' });
      expect(clearButton).toBeInTheDocument();
    });

    it('should clear value when clear button is clicked', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<SearchBar {...defaultProps} value="test" onChange={onChange} />);

      const clearButton = screen.getByRole('button', { name: 'Clear search' });
      await user.click(clearButton);

      expect(onChange).toHaveBeenCalledWith('');
    });

    it('should handle search submission', async () => {
      const user = userEvent.setup();
      const onSearch = jest.fn();
      render(<SearchBar {...defaultProps} value="test query" onSearch={onSearch} />);

      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, '{Enter}');

      expect(onSearch).toHaveBeenCalledWith('test query');
    });

    it('should handle search button click in icon-outside variant', async () => {
      const user = userEvent.setup();
      const onSearch = jest.fn();
      render(
        <SearchBar 
          {...defaultProps} 
          variant="icon-outside" 
          value="test query" 
          onSearch={onSearch} 
        />
      );

      const searchButton = screen.getByRole('button', { name: 'Search' });
      await user.click(searchButton);

      expect(onSearch).toHaveBeenCalledWith('test query');
    });

    it('should focus input when container is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchBar {...defaultProps} />);

      const container = screen.getByRole('search');
      const input = screen.getByPlaceholderText('Search...');

      await user.click(container);

      expect(input).toHaveFocus();
    });
  });

  describe('keyboard navigation', () => {
    it('should handle Enter key to submit search', async () => {
      const user = userEvent.setup();
      const onSearch = jest.fn();
      render(<SearchBar {...defaultProps} value="query" onSearch={onSearch} />);

      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, '{Enter}');

      expect(onSearch).toHaveBeenCalledWith('query');
    });

    it('should handle Escape key to clear search', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<SearchBar {...defaultProps} value="query" onChange={onChange} />);

      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, '{Escape}');

      expect(onChange).toHaveBeenCalledWith('');
    });
  });

  describe('disabled state', () => {
    it('should disable input when disabled prop is true', () => {
      render(<SearchBar {...defaultProps} />);

      const input = screen.getByPlaceholderText('Search...');
      expect(input).toBeDisabled();
    });

    it('should not show clear button when disabled', () => {
      render(<SearchBar {...defaultProps} value="test" />);

      const clearButton = screen.queryByRole('button', { name: 'Clear search' });
      expect(clearButton).not.toBeInTheDocument();
    });

    it('should disable search button when disabled', () => {
      render(<SearchBar {...defaultProps} variant="icon-outside" />);

      const searchButton = screen.getByRole('button', { name: 'Search' });
      expect(searchButton).toBeDisabled();
    });
  });

  describe('form integration', () => {
    it('should prevent form submission on Enter when onSearch is not provided', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      
      render(
        <form onSubmit={onSubmit}>
          <SearchBar {...defaultProps} />
        </form>
      );

      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, '{Enter}');

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have search role', () => {
      render(<SearchBar {...defaultProps} />);

      const container = screen.getByRole('search');
      expect(container).toBeInTheDocument();
    });

    it('should have proper aria labels', () => {
      render(<SearchBar {...defaultProps} />);

      const clearButton = screen.queryByRole('button', { name: 'Clear search' });
      if (clearButton) {
        expect(clearButton).toHaveAttribute('aria-label', 'Clear search');
      }
    });

    it('should have type search on input', () => {
      render(<SearchBar {...defaultProps} />);

      const input = screen.getByPlaceholderText('Search...');
      expect(input).toHaveAttribute('type', 'search');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string value', () => {
      render(<SearchBar {...defaultProps} value="" />);

      const input = screen.getByPlaceholderText('Search...');
      expect(input).toHaveValue('');
      
      const clearButton = screen.queryByRole('button', { name: 'Clear search' });
      expect(clearButton).not.toBeInTheDocument();
    });

    it('should handle very long search queries', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<SearchBar {...defaultProps} onChange={onChange} />);

      const longQuery = 'a'.repeat(500);
      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, longQuery);

      expect(onChange).toHaveBeenLastCalledWith(longQuery);
    });

    it('should handle rapid typing', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<SearchBar {...defaultProps} onChange={onChange} />);

      const input = screen.getByPlaceholderText('Search...');
      
      // Type rapidly
      await user.type(input, 'test');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledTimes(4);
      });
    });
  });
});