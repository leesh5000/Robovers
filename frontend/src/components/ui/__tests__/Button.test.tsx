import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600', 'text-white'); // primary variant
    expect(button).toHaveClass('px-4', 'py-2', 'text-sm'); // md size
  });

  it('should render different variants', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200', 'text-gray-900');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600', 'text-white');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-gray-600', 'hover:text-gray-900');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border', 'border-gray-300');
  });

  it('should render different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-base');
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('should show loading state', () => {
    render(<Button isLoading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('svg')).toBeInTheDocument(); // loading spinner
  });

  it('should render with left icon', () => {
    const leftIcon = <span data-testid="left-icon">🔍</span>;
    render(<Button leftIcon={leftIcon}>Search</Button>);
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('should render with right icon', () => {
    const rightIcon = <span data-testid="right-icon">→</span>;
    render(<Button rightIcon={rightIcon}>Next</Button>);
    
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should render full width when fullWidth is true', () => {
    render(<Button fullWidth>Full Width</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should not call onClick when loading', () => {
    const handleClick = jest.fn();
    render(<Button isLoading onClick={handleClick}>Loading</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should pass through other HTML attributes', () => {
    render(
      <Button 
        type="submit"
        form="test-form"
        data-testid="submit-button"
      >
        Submit
      </Button>
    );
    
    const button = screen.getByTestId('submit-button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('form', 'test-form');
  });
});