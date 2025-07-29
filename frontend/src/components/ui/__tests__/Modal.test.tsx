import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Modal content</div>
  };

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByText('Modal content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should render with title', () => {
    render(<Modal {...defaultProps} title="Test Modal" />);
    
    const title = screen.getByText('Test Modal');
    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute('id', 'modal-title');
  });

  it('should render different sizes', () => {
    const { rerender } = render(<Modal {...defaultProps} size="sm" />);
    expect(screen.getByRole('dialog')).toHaveClass('max-w-md');

    rerender(<Modal {...defaultProps} size="lg" />);
    expect(screen.getByRole('dialog')).toHaveClass('max-w-2xl');

    rerender(<Modal {...defaultProps} size="xl" />);
    expect(screen.getByRole('dialog')).toHaveClass('max-w-4xl');
  });

  it('should show close button by default', () => {
    render(<Modal {...defaultProps} title="Test Modal" />);
    
    const closeButton = screen.getByRole('button', { name: /닫기/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('should hide close button when showCloseButton is false', () => {
    render(
      <Modal {...defaultProps} title="Test Modal" showCloseButton={false} />
    );
    
    expect(screen.queryByRole('button', { name: /닫기/i })).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} title="Test Modal" />);
    
    const closeButton = screen.getByRole('button', { name: /닫기/i });
    await user.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);
    
    const backdrop = screen.getByRole('dialog').parentElement!;
    await user.click(backdrop);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when backdrop is clicked and closeOnBackdropClick is false', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} closeOnBackdropClick={false} />);
    
    const backdrop = screen.getByRole('dialog').parentElement!;
    await user.click(backdrop);
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('should not call onClose when modal content is clicked', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);
    
    const modalContent = screen.getByRole('dialog');
    await user.click(modalContent);
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('should call onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);
    
    await user.keyboard('{Escape}');
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when Escape key is pressed and closeOnEscape is false', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} closeOnEscape={false} />);
    
    await user.keyboard('{Escape}');
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('should render footer when provided', () => {
    const footer = (
      <div>
        <button>Cancel</button>
        <button>Confirm</button>
      </div>
    );
    
    render(<Modal {...defaultProps} footer={footer} />);
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Modal {...defaultProps} className="custom-modal" />);
    
    expect(screen.getByRole('dialog')).toHaveClass('custom-modal');
  });

  it('should set body overflow to hidden when modal is open', () => {
    render(<Modal {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body overflow when modal is closed', () => {
    const { rerender } = render(<Modal {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<Modal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('unset');
  });

  it('should have correct accessibility attributes', () => {
    render(<Modal {...defaultProps} title="Accessible Modal" />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('should not have aria-labelledby when no title is provided', () => {
    render(<Modal {...defaultProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('should handle keyboard navigation correctly', async () => {
    const user = userEvent.setup();
    render(
      <Modal {...defaultProps} title="Test Modal">
        <button>First Button</button>
        <button>Second Button</button>
      </Modal>
    );
    
    const firstButton = screen.getByText('First Button');
    const secondButton = screen.getByText('Second Button');
    const closeButton = screen.getByRole('button', { name: /닫기/i });
    
    // Close button should be first in tab order
    await user.tab();
    expect(closeButton).toHaveFocus();
    
    // Then the buttons in the modal content
    await user.tab();
    expect(firstButton).toHaveFocus();
    
    await user.tab();
    expect(secondButton).toHaveFocus();
  });

  it('should clean up event listeners when unmounted', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = render(<Modal {...defaultProps} />);
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should handle rapid open/close state changes', async () => {
    const { rerender } = render(<Modal {...defaultProps} isOpen={false} />);
    
    rerender(<Modal {...defaultProps} isOpen={true} />);
    expect(screen.getByText('Modal content')).toBeInTheDocument();
    
    rerender(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    
    rerender(<Modal {...defaultProps} isOpen={true} />);
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });
});