import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentForm from '../CommentForm';

describe('CommentForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  describe('Rendering', () => {
    it('should render textarea with default placeholder', () => {
      render(<CommentForm onSubmit={mockOnSubmit} />);

      expect(screen.getByPlaceholderText('댓글을 작성하세요...')).toBeInTheDocument();
    });

    it('should render textarea with custom placeholder', () => {
      render(
        <CommentForm 
          onSubmit={mockOnSubmit} 
          placeholder="답글을 작성하세요..." 
        />
      );

      expect(screen.getByPlaceholderText('답글을 작성하세요...')).toBeInTheDocument();
    });

    it('should render submit button with default text', () => {
      render(<CommentForm onSubmit={mockOnSubmit} />);

      expect(screen.getByRole('button', { name: '댓글 작성' })).toBeInTheDocument();
    });

    it('should render submit button with custom text', () => {
      render(
        <CommentForm 
          onSubmit={mockOnSubmit} 
          buttonText="답글 작성" 
        />
      );

      expect(screen.getByRole('button', { name: '답글 작성' })).toBeInTheDocument();
    });

    it('should render cancel button when showCancel is true and onCancel is provided', () => {
      render(
        <CommentForm 
          onSubmit={mockOnSubmit} 
          onCancel={mockOnCancel}
          showCancel={true}
        />
      );

      expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
    });

    it('should not render cancel button when showCancel is false', () => {
      render(
        <CommentForm 
          onSubmit={mockOnSubmit} 
          onCancel={mockOnCancel}
          showCancel={false}
        />
      );

      expect(screen.queryByRole('button', { name: '취소' })).not.toBeInTheDocument();
    });

    it('should render character counter', () => {
      render(<CommentForm onSubmit={mockOnSubmit} />);

      expect(screen.getByText('0/500자')).toBeInTheDocument();
    });

    it('should render guidelines', () => {
      render(<CommentForm onSubmit={mockOnSubmit} />);

      expect(screen.getByText('댓글 작성 시 주의사항:')).toBeInTheDocument();
      expect(screen.getByText('상호 존중하는 언어를 사용해주세요')).toBeInTheDocument();
      expect(screen.getByText('개인정보나 연락처는 공개하지 마세요')).toBeInTheDocument();
      expect(screen.getByText('광고나 홍보성 내용은 삼가해주세요')).toBeInTheDocument();
    });
  });

  describe('Form interactions', () => {
    it('should update character counter as user types', async () => {
      const user = userEvent.setup();
      render(<CommentForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText('댓글을 작성하세요...');
      await user.type(textarea, 'Hello');

      expect(screen.getByText('5/500자')).toBeInTheDocument();
    });

    it('should show warning when exceeding character limit', async () => {
      const user = userEvent.setup();
      render(<CommentForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText('댓글을 작성하세요...');
      const longText = 'a'.repeat(501);
      await user.type(textarea, longText);

      expect(screen.getByText('501/500자')).toBeInTheDocument();
      expect(screen.getByText('글자 수를 초과했습니다.')).toBeInTheDocument();
    });

    it('should disable submit button when text exceeds limit', async () => {
      const user = userEvent.setup();
      render(<CommentForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText('댓글을 작성하세요...');
      const submitButton = screen.getByRole('button', { name: '댓글 작성' });

      const longText = 'a'.repeat(501);
      await user.type(textarea, longText);

      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button when content is empty', () => {
      render(<CommentForm onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByRole('button', { name: '댓글 작성' });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when content is valid', async () => {
      const user = userEvent.setup();
      render(<CommentForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText('댓글을 작성하세요...');
      const submitButton = screen.getByRole('button', { name: '댓글 작성' });

      await user.type(textarea, '유효한 댓글입니다');

      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Form submission', () => {
    it('should submit form with trimmed content', async () => {
      const user = userEvent.setup();
      render(<CommentForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText('댓글을 작성하세요...');
      const submitButton = screen.getByRole('button', { name: '댓글 작성' });

      await user.type(textarea, '  댓글 내용  ');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('댓글 내용');
      });
    });

    it('should clear form after successful submission', async () => {
      const user = userEvent.setup();
      render(<CommentForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText('댓글을 작성하세요...') as HTMLTextAreaElement;
      const submitButton = screen.getByRole('button', { name: '댓글 작성' });

      await user.type(textarea, '댓글 내용');
      await user.click(submitButton);

      await waitFor(() => {
        expect(textarea.value).toBe('');
        expect(screen.getByText('0/500자')).toBeInTheDocument();
      });
    });

    it('should show alert when submitting empty content', async () => {
      const user = userEvent.setup();
      render(<CommentForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText('댓글을 작성하세요...');
      const submitButton = screen.getByRole('button', { name: '댓글 작성' });

      // Type only spaces
      await user.type(textarea, '   ');
      await user.click(submitButton);

      expect(window.alert).toHaveBeenCalledWith('댓글 내용을 입력해주세요.');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<CommentForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText('댓글을 작성하세요...');
      const submitButton = screen.getByRole('button', { name: '댓글 작성' });

      await user.type(textarea, '댓글 내용');
      await user.click(submitButton);

      expect(screen.getByText('작성 중...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      expect(textarea).toBeDisabled();

      await waitFor(() => {
        expect(screen.getByText('댓글 작성')).toBeInTheDocument();
        expect(submitButton).not.toBeDisabled();
        expect(textarea).not.toBeDisabled();
      });
    });

    it('should handle submission error', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockOnSubmit.mockRejectedValue(new Error('Submission failed'));

      render(<CommentForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText('댓글을 작성하세요...');
      const submitButton = screen.getByRole('button', { name: '댓글 작성' });

      await user.type(textarea, '댓글 내용');
      await user.click(submitButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('댓글 작성에 실패했습니다. 다시 시도해주세요.');
        expect(consoleErrorSpy).toHaveBeenCalledWith('댓글 작성 실패:', expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });

    it('should not clear form on submission error', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error('Submission failed'));

      render(<CommentForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText('댓글을 작성하세요...') as HTMLTextAreaElement;
      const submitButton = screen.getByRole('button', { name: '댓글 작성' });

      await user.type(textarea, '댓글 내용');
      await user.click(submitButton);

      await waitFor(() => {
        expect(textarea.value).toBe('댓글 내용');
      });
    });
  });

  describe('Cancel functionality', () => {
    it('should clear form when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CommentForm 
          onSubmit={mockOnSubmit} 
          onCancel={mockOnCancel}
          showCancel={true}
        />
      );

      const textarea = screen.getByPlaceholderText('댓글을 작성하세요...') as HTMLTextAreaElement;
      const cancelButton = screen.getByRole('button', { name: '취소' });

      await user.type(textarea, '댓글 내용');
      await user.click(cancelButton);

      expect(textarea.value).toBe('');
      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should disable cancel button during submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(
        <CommentForm 
          onSubmit={mockOnSubmit} 
          onCancel={mockOnCancel}
          showCancel={true}
        />
      );

      const textarea = screen.getByPlaceholderText('댓글을 작성하세요...');
      const submitButton = screen.getByRole('button', { name: '댓글 작성' });
      const cancelButton = screen.getByRole('button', { name: '취소' });

      await user.type(textarea, '댓글 내용');
      await user.click(submitButton);

      expect(cancelButton).toBeDisabled();

      await waitFor(() => {
        expect(cancelButton).not.toBeDisabled();
      });
    });
  });

  describe('Keyboard interactions', () => {
    it('should submit form when pressing Enter with Ctrl/Cmd', async () => {
      const user = userEvent.setup();
      render(<CommentForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText('댓글을 작성하세요...');

      await user.type(textarea, '댓글 내용');
      await user.keyboard('{Control>}{Enter}{/Control}');

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('댓글 내용');
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle very long content within limit', async () => {
      const user = userEvent.setup();
      render(<CommentForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText('댓글을 작성하세요...');
      const submitButton = screen.getByRole('button', { name: '댓글 작성' });

      const longText = 'a'.repeat(500);
      await user.type(textarea, longText);

      expect(screen.getByText('500/500자')).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();

      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(longText);
      });
    });

    it('should handle rapid submission attempts', async () => {
      const user = userEvent.setup();
      render(<CommentForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText('댓글을 작성하세요...');
      const submitButton = screen.getByRole('button', { name: '댓글 작성' });

      await user.type(textarea, '댓글 내용');
      await user.click(submitButton);
      await user.click(submitButton); // Double click

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
});