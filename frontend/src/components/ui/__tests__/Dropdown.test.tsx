import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown, { DropdownOption } from '../Dropdown';

describe('Dropdown', () => {
  const mockOptions: DropdownOption[] = [
    { value: 'option1', label: '옵션 1' },
    { value: 'option2', label: '옵션 2' },
    { value: 'option3', label: '옵션 3', disabled: true },
    { value: 'option4', label: '옵션 4' },
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render with placeholder when no value is selected', () => {
      render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
          placeholder="선택해주세요"
        />
      );

      expect(screen.getByText('선택해주세요')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });

    it('should render with selected value', () => {
      render(
        <Dropdown
          options={mockOptions}
          value="option2"
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText('옵션 2')).toBeInTheDocument();
    });

    it('should apply disabled state', () => {
      render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
          disabled={true}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('bg-gray-100', 'cursor-not-allowed');
    });

    it('should apply size classes', () => {
      const { rerender } = render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
          size="sm"
        />
      );

      expect(screen.getByRole('button')).toHaveClass('px-2', 'py-1', 'text-sm');

      rerender(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
          size="lg"
        />
      );

      expect(screen.getByRole('button')).toHaveClass('px-4', 'py-3', 'text-lg');
    });

    it('should apply custom className', () => {
      render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
          className="custom-class"
        />
      );

      expect(screen.getByRole('button').parentElement).toHaveClass('custom-class');
    });
  });

  describe('dropdown toggle', () => {
    it('should open dropdown when clicked', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('옵션 1')).toBeInTheDocument();
      expect(screen.getByText('옵션 2')).toBeInTheDocument();
      expect(screen.getByText('옵션 3')).toBeInTheDocument();
      expect(screen.getByText('옵션 4')).toBeInTheDocument();
    });

    it('should close dropdown when clicked again', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      
      // Open
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      
      // Close
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('옵션 1')).not.toBeInTheDocument();
    });

    it('should not open when disabled', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
          disabled={true}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('옵션 1')).not.toBeInTheDocument();
    });
  });

  describe('option selection', () => {
    it('should select option when clicked', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      const option2 = screen.getByText('옵션 2');
      await user.click(option2);

      expect(mockOnChange).toHaveBeenCalledWith('option2');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should not select disabled option', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      const disabledOption = screen.getByText('옵션 3');
      await user.click(disabledOption);

      expect(mockOnChange).not.toHaveBeenCalled();
      expect(button).toHaveAttribute('aria-expanded', 'true'); // Still open
    });

    it('should highlight selected option', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          value="option2"
          onChange={mockOnChange}
        />
      );

      await user.click(screen.getByRole('button'));

      const selectedOption = screen.getByText('옵션 2');
      expect(selectedOption).toHaveClass('bg-blue-100', 'text-blue-700', 'font-medium');
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('keyboard navigation', () => {
    it('should close dropdown on Escape key', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Escape}');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should navigate options with arrow keys', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
        />
      );

      await user.click(screen.getByRole('button'));

      // Press ArrowDown
      await user.keyboard('{ArrowDown}');
      let options = screen.getAllByRole('option');
      expect(options[0]).toHaveClass('bg-blue-50', 'text-blue-600');

      // Press ArrowDown again
      await user.keyboard('{ArrowDown}');
      options = screen.getAllByRole('option');
      expect(options[1]).toHaveClass('bg-blue-50', 'text-blue-600');

      // Press ArrowUp
      await user.keyboard('{ArrowUp}');
      options = screen.getAllByRole('option');
      expect(options[0]).toHaveClass('bg-blue-50', 'text-blue-600');
    });

    it('should select option with Enter key', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
        />
      );

      await user.click(screen.getByRole('button'));

      // Navigate to second option
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      // Select with Enter
      await user.keyboard('{Enter}');

      expect(mockOnChange).toHaveBeenCalledWith('option2');
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });

    it('should not select disabled option with Enter key', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
        />
      );

      await user.click(screen.getByRole('button'));

      // Navigate to third option (disabled)
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      // Try to select with Enter
      await user.keyboard('{Enter}');

      expect(mockOnChange).not.toHaveBeenCalled();
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    });

    it('should not navigate beyond boundaries', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
        />
      );

      await user.click(screen.getByRole('button'));

      // Try to go up from first option
      await user.keyboard('{ArrowUp}');
      const options = screen.getAllByRole('option');
      // No option should be highlighted
      options.forEach(option => {
        expect(option).not.toHaveClass('bg-blue-50', 'text-blue-600');
      });

      // Navigate to last option
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      // Try to go down from last option
      await user.keyboard('{ArrowDown}');
      expect(options[3]).toHaveClass('bg-blue-50', 'text-blue-600');
    });
  });

  describe('click outside', () => {
    it('should close dropdown when clicking outside', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <div data-testid="outside">Outside element</div>
          <Dropdown
            options={mockOptions}
            onChange={mockOnChange}
          />
        </div>
      );

      const button = screen.getByRole('button');
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      // Click outside
      const outsideElement = screen.getByTestId('outside');
      await user.click(outsideElement);

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('should not close when clicking inside dropdown', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      // Click on the dropdown container (not an option)
      const dropdown = button.parentElement;
      await user.click(dropdown!);

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          value="option1"
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-haspopup', 'listbox');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('aria-selected', 'true');
      expect(options[1]).toHaveAttribute('aria-selected', 'false');
    });

    it('should show disabled state for disabled options', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
        />
      );

      await user.click(screen.getByRole('button'));

      const disabledOption = screen.getByText('옵션 3');
      expect(disabledOption).toHaveClass('text-gray-400', 'cursor-not-allowed');
      expect(disabledOption).toBeDisabled();
    });
  });

  describe('icon rotation', () => {
    it('should rotate arrow icon when open', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          onChange={mockOnChange}
        />
      );

      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');

      expect(svg).not.toHaveClass('rotate-180');

      await user.click(button);
      expect(svg).toHaveClass('rotate-180');

      await user.click(button);
      expect(svg).not.toHaveClass('rotate-180');
    });
  });
});