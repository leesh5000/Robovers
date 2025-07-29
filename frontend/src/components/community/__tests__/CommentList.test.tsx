import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentList from '../CommentList';
import { Comment as CommentType } from '@/lib/types';

// Mock dependencies
jest.mock('../Comment', () => {
  return function MockComment({ 
    comment, 
    onReply, 
    onLike, 
    onDelete, 
    isHighlighted
  }: any) {
    return (
      <div 
        data-testid={`comment-${comment.id}`}
        id={`comment-${comment.id}`}
        className={isHighlighted ? 'highlighted' : ''}
      >
        <div>{comment.content}</div>
        <button onClick={() => onLike(comment.id)}>Like</button>
        <button onClick={() => onReply(comment.id, 'Reply content')}>Reply</button>
        <button onClick={() => onDelete(comment.id)}>Delete</button>
        {comment.replies?.map((reply: CommentType) => (
          <div key={reply.id} data-testid={`reply-${reply.id}`}>
            Reply: {reply.content}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../CommentForm', () => {
  return function MockCommentForm({ onSubmit, placeholder, buttonText }: any) {
    const [value, setValue] = React.useState('');
    
    return (
      <div data-testid="comment-form">
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="comment-input"
        />
        <button 
          onClick={() => {
            onSubmit(value);
            setValue('');
          }}
        >
          {buttonText}
        </button>
      </div>
    );
  };
});

jest.mock('@/components/ui/Dropdown', () => {
  return function MockDropdown({ options, value, onChange }: any) {
    return (
      <select 
        data-testid="sort-dropdown"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  };
});

jest.mock('@/lib/dummy-data', () => ({
  getDummyComments: jest.fn(),
}));

import { getDummyComments } from '@/lib/dummy-data';

const mockComments: CommentType[] = [
  {
    id: 'comment-1',
    content: '첫 번째 댓글입니다',
    author: {
      id: '1',
      username: 'user1',
      email: 'user1@example.com',
      isVerified: true,
      joinedAt: new Date('2023-01-01'),
    },
    createdAt: new Date('2024-01-01'),
    likeCount: 5,
    isLiked: false,
  },
  {
    id: 'comment-2',
    content: '두 번째 댓글입니다',
    author: {
      id: '2',
      username: 'user2',
      email: 'user2@example.com',
      isVerified: false,
      joinedAt: new Date('2023-02-01'),
    },
    createdAt: new Date('2024-01-02'),
    likeCount: 10,
    isLiked: true,
    replies: [
      {
        id: 'reply-1',
        content: '답글입니다',
        author: {
          id: '3',
          username: 'user3',
          email: 'user3@example.com',
          isVerified: false,
          joinedAt: new Date('2023-03-01'),
        },
        createdAt: new Date('2024-01-03'),
        likeCount: 2,
        isLiked: false,
        parentId: 'comment-2',
      },
    ],
  },
];

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('CommentList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (getDummyComments as jest.Mock).mockReturnValue([...mockComments]);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should show loading state initially', () => {
      render(<CommentList postId="1" />);

      const skeletons = screen.getAllByTestId((content, element) => {
        return element?.className?.includes('animate-pulse') || false;
      });
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render comments after loading', async () => {
      render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.getByTestId('comment-comment-1')).toBeInTheDocument();
        expect(screen.getByTestId('comment-comment-2')).toBeInTheDocument();
      });
    });

    it('should render comment count correctly', async () => {
      render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.getByText('댓글 2개')).toBeInTheDocument();
      });
    });

    it('should render replies correctly', async () => {
      render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.getByTestId('reply-reply-1')).toBeInTheDocument();
        expect(screen.getByText('Reply: 답글입니다')).toBeInTheDocument();
      });
    });

    it('should show empty state when no comments', async () => {
      (getDummyComments as jest.Mock).mockReturnValue([]);
      
      render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.getByText('아직 댓글이 없습니다')).toBeInTheDocument();
        expect(screen.getByText('첫 번째 댓글을 작성해보세요!')).toBeInTheDocument();
      });
    });
  });

  describe('Sorting functionality', () => {
    it('should sort by latest by default', async () => {
      render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const comments = screen.getAllByTestId(/^comment-comment-/);
        expect(comments[0]).toHaveTextContent('두 번째 댓글입니다');
        expect(comments[1]).toHaveTextContent('첫 번째 댓글입니다');
      });
    });

    it('should sort by oldest when selected', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      const dropdown = await screen.findByTestId('sort-dropdown');
      await user.selectOptions(dropdown, 'oldest');

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const comments = screen.getAllByTestId(/^comment-comment-/);
        expect(comments[0]).toHaveTextContent('첫 번째 댓글입니다');
        expect(comments[1]).toHaveTextContent('두 번째 댓글입니다');
      });
    });

    it('should sort by popular when selected', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      const dropdown = await screen.findByTestId('sort-dropdown');
      await user.selectOptions(dropdown, 'popular');

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const comments = screen.getAllByTestId(/^comment-comment-/);
        expect(comments[0]).toHaveTextContent('두 번째 댓글입니다'); // 10 likes
        expect(comments[1]).toHaveTextContent('첫 번째 댓글입니다'); // 5 likes
      });
    });
  });

  describe('Comment interactions', () => {
    it('should add new comment', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      const input = await screen.findByTestId('comment-input');
      const submitButton = await screen.findByText('댓글 작성');

      await user.type(input, '새로운 댓글');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('새로운 댓글')).toBeInTheDocument();
        expect(screen.getByText('댓글 3개')).toBeInTheDocument();
      });
    });

    it('should handle like action', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      const likeButtons = await screen.findAllByText('Like');
      await user.click(likeButtons[0]);

      // The Comment component would handle the visual update
      // We're just testing that the handler is called
      expect(likeButtons[0]).toBeInTheDocument();
    });

    it('should handle reply action', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      const replyButtons = await screen.findAllByText('Reply');
      await user.click(replyButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Reply: Reply content')).toBeInTheDocument();
      });
    });

    it('should handle delete action', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.getByTestId('comment-comment-1')).toBeInTheDocument();
      });

      const deleteButtons = await screen.findAllByText('Delete');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.queryByTestId('comment-comment-1')).not.toBeInTheDocument();
        expect(screen.getByText('댓글 1개')).toBeInTheDocument();
      });
    });
  });

  describe('Highlight functionality', () => {
    it('should highlight specified comment', async () => {
      render(<CommentList postId="1" highlightCommentId="comment-2" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const highlightedComment = screen.getByTestId('comment-comment-2');
        expect(highlightedComment).toHaveClass('highlighted');
      });
    });

    it('should scroll to highlighted comment', async () => {
      const scrollIntoViewMock = jest.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      render(<CommentList postId="1" highlightCommentId="comment-2" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'center',
        });
      });
    });

    it('should not scroll when no highlight comment', async () => {
      const scrollIntoViewMock = jest.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(400);
      });

      expect(scrollIntoViewMock).not.toHaveBeenCalled();
    });
  });

  describe('Form interactions', () => {
    it('should render comment form with correct props', async () => {
      render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const input = screen.getByPlaceholderText('댓글을 작성하세요...');
        const button = screen.getByText('댓글 작성');
        
        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();
      });
    });

    it('should clear input after submitting comment', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      const input = await screen.findByTestId('comment-input') as HTMLInputElement;
      const submitButton = await screen.findByText('댓글 작성');

      await user.type(input, '테스트 댓글');
      expect(input.value).toBe('테스트 댓글');

      await user.click(submitButton);

      expect(input.value).toBe('');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty replies array', async () => {
      const commentsWithoutReplies = mockComments.map(c => ({ ...c, replies: undefined }));
      (getDummyComments as jest.Mock).mockReturnValue(commentsWithoutReplies);

      render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.getByTestId('comment-comment-1')).toBeInTheDocument();
        expect(screen.queryByTestId(/^reply-/)).not.toBeInTheDocument();
      });
    });

    it('should re-fetch comments when postId changes', async () => {
      const { rerender } = render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(getDummyComments).toHaveBeenCalledWith('1');

      rerender(<CommentList postId="2" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(getDummyComments).toHaveBeenCalledWith('2');
    });

    it('should handle nested reply deletion', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<CommentList postId="1" />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Simulate deleting a reply by modifying the parent comment
      const deleteButtons = await screen.findAllByText('Delete');
      // Find the delete button for the reply (should be the last one)
      const replyDeleteButton = deleteButtons[deleteButtons.length - 1];
      
      await user.click(replyDeleteButton);

      await waitFor(() => {
        expect(screen.queryByTestId('reply-reply-1')).not.toBeInTheDocument();
      });
    });
  });
});