import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../Input';

describe('Input', () => {
  it('should render basic input', () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('block', 'w-full', 'rounded-md');
  });

  it('should render with label', () => {
    render(<Input label="Email Address" />);
    
    const label = screen.getByText('Email Address');
    const input = screen.getByLabelText('Email Address');
    
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(label).toHaveAttribute('for', input.id);
  });

  it('should show error state and message', () => {
    render(<Input label="Email" error="Invalid email address" />);
    
    const input = screen.getByLabelText('Email');
    const errorMessage = screen.getByText('Invalid email address');
    
    expect(input).toHaveClass('border-red-300', 'focus:border-red-500');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('should show help text', () => {
    render(<Input label="Password" helpText="최소 8자 이상 입력하세요" />);
    
    const helpText = screen.getByText('최소 8자 이상 입력하세요');
    expect(helpText).toBeInTheDocument();
    expect(helpText).toHaveClass('text-gray-500');
  });

  it('should prioritize error message over help text', () => {
    render(
      <Input 
        label="Password" 
        error="Password too short" 
        helpText="최소 8자 이상 입력하세요" 
      />
    );
    
    expect(screen.getByText('Password too short')).toBeInTheDocument();
    expect(screen.queryByText('최소 8자 이상 입력하세요')).not.toBeInTheDocument();
  });

  it('should render with left icon', () => {
    const leftIcon = <span data-testid="left-icon">🔍</span>;
    render(<Input leftIcon={leftIcon} />);
    
    const input = screen.getByRole('textbox');
    const icon = screen.getByTestId('left-icon');
    
    expect(icon).toBeInTheDocument();
    expect(input).toHaveClass('pl-10');
  });

  it('should render with right icon', () => {
    const rightIcon = <span data-testid="right-icon">👁️</span>;
    render(<Input rightIcon={rightIcon} />);
    
    const input = screen.getByRole('textbox');
    const icon = screen.getByTestId('right-icon');
    
    expect(icon).toBeInTheDocument();
    expect(input).toHaveClass('pr-10');
  });

  it('should render with both left and right icons', () => {
    const leftIcon = <span data-testid="left-icon">🔍</span>;
    const rightIcon = <span data-testid="right-icon">👁️</span>;
    
    render(<Input leftIcon={leftIcon} rightIcon={rightIcon} />);
    
    const input = screen.getByRole('textbox');
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(input).toHaveClass('pl-10', 'pr-10');
  });

  it('should handle input changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test input' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('test input');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:bg-gray-50', 'disabled:text-gray-500');
  });

  it('should apply custom className to container', () => {
    render(<Input containerClassName="custom-container" />);
    
    const container = screen.getByRole('textbox').closest('div');
    expect(container?.parentElement).toHaveClass('custom-container');
  });

  it('should apply custom className to input', () => {
    render(<Input className="custom-input" />);
    
    expect(screen.getByRole('textbox')).toHaveClass('custom-input');
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should use custom id when provided', () => {
    render(<Input id="custom-id" label="Custom Label" />);
    
    const input = screen.getByRole('textbox');
    const label = screen.getByText('Custom Label');
    
    expect(input).toHaveAttribute('id', 'custom-id');
    expect(label).toHaveAttribute('for', 'custom-id');
  });

  it('should generate id from label when no id provided', () => {
    render(<Input label="Email Address" />);
    
    const input = screen.getByRole('textbox');
    const label = screen.getByText('Email Address');
    
    expect(input).toHaveAttribute('id', 'email-address');
    expect(label).toHaveAttribute('for', 'email-address');
  });

  it('should pass through HTML input attributes', () => {
    render(
      <Input 
        type="email"
        placeholder="Enter email"
        maxLength={50}
        required
        data-testid="email-input"
      />
    );
    
    const input = screen.getByTestId('email-input');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter email');
    expect(input).toHaveAttribute('maxLength', '50');
    expect(input).toHaveAttribute('required');
  });
});