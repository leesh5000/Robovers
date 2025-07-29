import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Comment from '../Comment';
import { Comment as CommentType } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

// Mock dependencies
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ src, alt, width, height, className }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  }) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        data-testid="avatar-image"
      />
    );
  },
}));

jest.mock('../CommentForm', () => {
  return function MockCommentForm({ onSubmit, onCancel, placeholder, buttonText }: {
    onSubmit: (value: string) => void;
    onCancel?: () => void;
    placeholder?: string;
    buttonText?: string;
  }) {
    const [value, setValue] = React.useState('');
    
    return (
      <div data-testid="comment-form">
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="reply-input"
        />
        <button 
          onClick={() => {
            onSubmit(value);
            setValue('');
          }}
        >
          {buttonText}
        </button>
        {onCancel && (
          <button onClick={onCancel} data-testid="cancel-button">
            취소
          </button>
        )}
      </div>
    );
  };
});

// Mock date-fns
jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(),
}));

const mockComment: CommentType = {
  id: 'comment-1',
  content: '테스트 댓글입니다',
  author: {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    avatar: '/avatar.jpg',
    isVerified: true,
    joinedAt: new Date('2023-01-01'),
  },
  createdAt: new Date('2024-01-01'),
  likeCount: 5,
  isLiked: false,
};

const mockCommentWithReplies: CommentType = {
  ...mockComment,
  replies: [
    {
      id: 'reply-1',
      content: '첫 번째 답글',
      author: {
        id: '2',
        username: 'replyuser1',
        email: 'reply1@example.com',
        isVerified: false,
        joinedAt: new Date('2023-02-01'),
      },
      createdAt: new Date('2024-01-02'),
      likeCount: 2,
      isLiked: true,
      parentId: 'comment-1',
    },
    {
      id: 'reply-2',
      content: '두 번째 답글',
      author: {
        id: '3',
        username: 'replyuser2',
        email: 'reply2@example.com',
        isVerified: false,
        joinedAt: new Date('2023-03-01'),
      },
      createdAt: new Date('2024-01-03'),
      likeCount: 0,
      isLiked: false,
      parentId: 'comment-1',
    },
  ],
};

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('Comment', () => {
  const mockOnReply = jest.fn();
  const mockOnLike = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn(() => true);
    (formatDistanceToNow as jest.Mock).mockReturnValue('1일 전');
  });

  describe('Rendering', () => {
    it('should render comment content and author information', () => {
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('테스트 댓글입니다')).toBeInTheDocument();
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('1일 전')).toBeInTheDocument();
    });

    it('should render avatar image when provided', () => {
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      const avatar = screen.getByTestId('avatar-image');
      expect(avatar).toHaveAttribute('src', '/avatar.jpg');
      expect(avatar).toHaveAttribute('alt', 'testuser');
    });

    it('should render initial letter when avatar is not provided', () => {
      const commentWithoutAvatar = {
        ...mockComment,
        author: { ...mockComment.author, avatar: undefined },
      };

      render(
        <Comment 
          comment={commentWithoutAvatar} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('should render verified badge for verified users', () => {
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      const verifiedBadge = screen.getByRole('img', { hidden: true });
      expect(verifiedBadge).toBeInTheDocument();
    });

    it('should not render verified badge for non-verified users', () => {
      const unverifiedComment = {
        ...mockComment,
        author: { ...mockComment.author, isVerified: false },
      };

      render(
        <Comment 
          comment={unverifiedComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      const verifiedBadges = screen.queryAllByRole('img', { hidden: true });
      expect(verifiedBadges).toHaveLength(0);
    });

    it('should render like count correctly', () => {
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should render "좋아요" when like count is 0', () => {
      const commentWithNoLikes = {
        ...mockComment,
        likeCount: 0,
      };

      render(
        <Comment 
          comment={commentWithNoLikes} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('좋아요')).toBeInTheDocument();
    });

    it('should apply highlighted styles when isHighlighted is true', () => {
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
          isHighlighted={true}
        />
      );

      const commentElement = screen.getByText('테스트 댓글입니다').closest('.bg-white');
      expect(commentElement).toHaveClass('border-blue-400', 'bg-blue-50', 'animate-pulse-slow');
    });

    it('should apply correct margin for nested comments', () => {
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
          depth={1}
        />
      );

      const container = screen.getByText('테스트 댓글입니다').closest('.ml-8');
      expect(container).toHaveClass('ml-8', 'pl-4', 'border-l-2', 'border-gray-100');
    });
  });

  describe('Like functionality', () => {
    it('should handle like button click', async () => {
      const user = userEvent.setup();
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      const likeButton = screen.getByRole('button', { name: /5/ });
      await user.click(likeButton);

      expect(mockOnLike).toHaveBeenCalledWith('comment-1');
    });

    it('should update UI when like button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      const likeButton = screen.getByRole('button', { name: /5/ });
      await user.click(likeButton);

      expect(screen.getByText('6')).toBeInTheDocument();
      expect(likeButton).toHaveClass('text-red-600');
    });

    it('should handle unlike', async () => {
      const user = userEvent.setup();
      const likedComment = {
        ...mockComment,
        isLiked: true,
        likeCount: 6,
      };

      render(
        <Comment 
          comment={likedComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      const likeButton = screen.getByRole('button', { name: /6/ });
      expect(likeButton).toHaveClass('text-red-600');

      await user.click(likeButton);

      expect(screen.getByText('5')).toBeInTheDocument();
      expect(mockOnLike).toHaveBeenCalledWith('comment-1');
    });
  });

  describe('Reply functionality', () => {
    it('should show reply button for top-level comments', () => {
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
          depth={0}
        />
      );

      expect(screen.getByRole('button', { name: '답글' })).toBeInTheDocument();
    });

    it('should show reply button for first-level replies', () => {
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
          depth={1}
        />
      );

      expect(screen.getByRole('button', { name: '답글' })).toBeInTheDocument();
    });

    it('should not show reply button for second-level replies', () => {
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
          depth={2}
        />
      );

      expect(screen.queryByRole('button', { name: '답글' })).not.toBeInTheDocument();
    });

    it('should toggle reply form when reply button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      const replyButton = screen.getByRole('button', { name: '답글' });
      
      // Show form
      await user.click(replyButton);
      expect(screen.getByTestId('comment-form')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('답글을 작성하세요...')).toBeInTheDocument();

      // Hide form
      await user.click(replyButton);
      expect(screen.queryByTestId('comment-form')).not.toBeInTheDocument();
    });

    it('should submit reply and close form', async () => {
      const user = userEvent.setup();
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      const replyButton = screen.getByRole('button', { name: '답글' });
      await user.click(replyButton);

      const input = screen.getByTestId('reply-input');
      await user.type(input, '답글 내용');

      const submitButton = screen.getByRole('button', { name: '답글 작성' });
      await user.click(submitButton);

      expect(mockOnReply).toHaveBeenCalledWith('comment-1', '답글 내용');
      expect(screen.queryByTestId('comment-form')).not.toBeInTheDocument();
    });

    it('should cancel reply form when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      const replyButton = screen.getByRole('button', { name: '답글' });
      await user.click(replyButton);

      const cancelButton = screen.getByTestId('cancel-button');
      await user.click(cancelButton);

      expect(screen.queryByTestId('comment-form')).not.toBeInTheDocument();
    });
  });

  describe('Delete functionality', () => {
    it('should show confirmation dialog before deleting', async () => {
      const user = userEvent.setup();
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByRole('button', { name: '삭제' });
      await user.click(deleteButton);

      expect(window.confirm).toHaveBeenCalledWith('정말로 이 댓글을 삭제하시겠습니까?');
      expect(mockOnDelete).toHaveBeenCalledWith('comment-1');
    });

    it('should not delete when confirmation is cancelled', async () => {
      window.confirm = jest.fn(() => false);
      const user = userEvent.setup();
      
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByRole('button', { name: '삭제' });
      await user.click(deleteButton);

      expect(window.confirm).toHaveBeenCalled();
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  describe('Replies handling', () => {
    it('should render replies when present', () => {
      render(
        <Comment 
          comment={mockCommentWithReplies} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('첫 번째 답글')).toBeInTheDocument();
      expect(screen.getByText('두 번째 답글')).toBeInTheDocument();
    });

    it('should show expand/collapse button when replies exist', () => {
      render(
        <Comment 
          comment={mockCommentWithReplies} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByRole('button', { name: '답글 숨기기' })).toBeInTheDocument();
    });

    it('should toggle replies visibility', async () => {
      const user = userEvent.setup();
      render(
        <Comment 
          comment={mockCommentWithReplies} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      const toggleButton = screen.getByRole('button', { name: '답글 숨기기' });
      
      // Collapse replies
      await user.click(toggleButton);
      expect(screen.queryByText('첫 번째 답글')).not.toBeInTheDocument();
      expect(screen.queryByText('두 번째 답글')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: '답글 2개 보기' })).toBeInTheDocument();

      // Expand replies
      await user.click(screen.getByRole('button', { name: '답글 2개 보기' }));
      expect(screen.getByText('첫 번째 답글')).toBeInTheDocument();
      expect(screen.getByText('두 번째 답글')).toBeInTheDocument();
    });

    it('should pass correct depth to nested replies', () => {
      render(
        <Comment 
          comment={mockCommentWithReplies} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
          depth={0}
        />
      );

      // Check that nested replies have proper margin
      const nestedReply = screen.getByText('첫 번째 답글').closest('.ml-8');
      expect(nestedReply).toBeInTheDocument();
    });

    it('should highlight specific reply when highlightCommentId matches', () => {
      render(
        <Comment 
          comment={mockCommentWithReplies} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
          highlightCommentId="reply-1"
        />
      );

      const highlightedReply = screen.getByText('첫 번째 답글').closest('.bg-white');
      expect(highlightedReply).toHaveClass('border-blue-400', 'bg-blue-50');
    });

    it('should auto-expand replies when a reply is highlighted', () => {
      const collapsedComment = {
        ...mockCommentWithReplies,
      };

      render(
        <Comment 
          comment={collapsedComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
          highlightCommentId="reply-1"
        />
      );

      // Replies should be visible even though not manually expanded
      expect(screen.getByText('첫 번째 답글')).toBeInTheDocument();
      expect(screen.getByText('두 번째 답글')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle comment with no replies array', () => {
      const commentWithoutReplies = {
        ...mockComment,
        replies: undefined,
      };

      render(
        <Comment 
          comment={commentWithoutReplies} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.queryByRole('button', { name: /답글.*개 보기/ })).not.toBeInTheDocument();
    });

    it('should handle comment with empty replies array', () => {
      const commentWithEmptyReplies = {
        ...mockComment,
        replies: [],
      };

      render(
        <Comment 
          comment={commentWithEmptyReplies} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.queryByRole('button', { name: /답글.*개 보기/ })).not.toBeInTheDocument();
    });

    it('should handle very long content with proper wrapping', () => {
      const longContentComment = {
        ...mockComment,
        content: 'a'.repeat(500),
      };

      render(
        <Comment 
          comment={longContentComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      const contentElement = screen.getByText('a'.repeat(500));
      expect(contentElement).toHaveClass('whitespace-pre-wrap');
    });

    it('should handle comment without handlers gracefully', () => {
      render(<Comment comment={mockComment} />);

      expect(screen.getByText('테스트 댓글입니다')).toBeInTheDocument();
      
      // Buttons should still render but clicking them shouldn't cause errors
      const likeButton = screen.getByRole('button', { name: /5/ });
      expect(likeButton).toBeInTheDocument();
    });

    it('should format time correctly with locale', () => {
      render(
        <Comment 
          comment={mockComment} 
          onReply={mockOnReply}
          onLike={mockOnLike}
          onDelete={mockOnDelete}
        />
      );

      expect(formatDistanceToNow).toHaveBeenCalledWith(
        mockComment.createdAt,
        {
          addSuffix: true,
          locale: ko,
        }
      );
    });
  });
});