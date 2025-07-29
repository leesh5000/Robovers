import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import PostDetail from '../PostDetail';
import { CommunityPost, CommunityCategory } from '@/lib/types';

// Mock dependencies
jest.mock('../CommentList', () => {
  return function MockCommentList({ postId, highlightCommentId }: any) {
    return (
      <div data-testid="comment-list">
        CommentList - PostId: {postId}, HighlightId: {highlightCommentId}
      </div>
    );
  };
});

// Mock navigator.share and navigator.clipboard
Object.assign(navigator, {
  share: jest.fn(),
  clipboard: {
    writeText: jest.fn(),
  },
});

const mockPost: CommunityPost = {
  id: '1',
  title: '휴머노이드 로봇의 미래',
  content: '휴머노이드 로봇 기술이 빠르게 발전하고 있습니다...',
  category: 'technical',
  tags: ['휴머노이드', '로봇', 'AI'],
  author: {
    id: '1',
    username: 'techuser',
    email: 'techuser@example.com',
    avatar: '/avatar.jpg',
    isVerified: true,
    joinedAt: new Date('2023-01-01'),
  },
  viewCount: 1234,
  likeCount: 45,
  commentCount: 12,
  isPinned: false,
  isLiked: false,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

describe('PostDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  describe('Rendering', () => {
    it('should render post title and content', () => {
      render(<PostDetail post={mockPost} />);

      expect(screen.getByText('휴머노이드 로봇의 미래')).toBeInTheDocument();
      expect(screen.getByText('휴머노이드 로봇 기술이 빠르게 발전하고 있습니다...')).toBeInTheDocument();
    });

    it('should render category with correct style', () => {
      render(<PostDetail post={mockPost} />);

      const categoryElement = screen.getByText('기술');
      expect(categoryElement).toHaveClass('bg-blue-100', 'text-blue-700');
    });

    it('should render author information', () => {
      render(<PostDetail post={mockPost} />);

      expect(screen.getByText('techuser')).toBeInTheDocument();
      expect(screen.getByAltText('techuser')).toBeInTheDocument();
    });

    it('should render author initial when avatar is not provided', () => {
      const postWithoutAvatar = {
        ...mockPost,
        author: { ...mockPost.author, avatar: undefined },
      };
      render(<PostDetail post={postWithoutAvatar} />);

      expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('should render verified badge for verified authors', () => {
      render(<PostDetail post={mockPost} />);

      const verifiedBadge = screen.getByRole('img', { hidden: true });
      expect(verifiedBadge).toBeInTheDocument();
    });

    it('should render pinned indicator for pinned posts', () => {
      const pinnedPost = { ...mockPost, isPinned: true };
      render(<PostDetail post={pinnedPost} />);

      expect(screen.getByText('고정됨')).toBeInTheDocument();
    });

    it('should render tags', () => {
      render(<PostDetail post={mockPost} />);

      expect(screen.getByText('#휴머노이드')).toBeInTheDocument();
      expect(screen.getByText('#로봇')).toBeInTheDocument();
      expect(screen.getByText('#AI')).toBeInTheDocument();
    });

    it('should render view count and comment count', () => {
      render(<PostDetail post={mockPost} />);

      expect(screen.getByText('조회 1,234')).toBeInTheDocument();
      expect(screen.getByText('댓글 12')).toBeInTheDocument();
    });

    it('should render creation time in relative format', () => {
      render(<PostDetail post={mockPost} />);

      const expectedTime = formatDistanceToNow(mockPost.createdAt, {
        addSuffix: true,
        locale: ko,
      });
      expect(screen.getByText(expectedTime)).toBeInTheDocument();
    });

    it('should render CommentList component', () => {
      render(<PostDetail post={mockPost} highlightCommentId="123" />);

      const commentList = screen.getByTestId('comment-list');
      expect(commentList).toBeInTheDocument();
      expect(commentList).toHaveTextContent('PostId: 1');
      expect(commentList).toHaveTextContent('HighlightId: 123');
    });
  });

  describe('Like functionality', () => {
    it('should toggle like state when like button is clicked', async () => {
      const user = userEvent.setup();
      render(<PostDetail post={mockPost} />);

      const likeButton = screen.getByRole('button', { name: /45/i });
      expect(likeButton).toHaveClass('bg-gray-100', 'text-gray-600');

      await user.click(likeButton);

      expect(likeButton).toHaveClass('bg-red-50', 'text-red-600');
      expect(screen.getByText('46')).toBeInTheDocument();

      await user.click(likeButton);

      expect(likeButton).toHaveClass('bg-gray-100', 'text-gray-600');
      expect(screen.getByText('45')).toBeInTheDocument();
    });

    it('should show liked state if post is already liked', () => {
      const likedPost = { ...mockPost, isLiked: true };
      render(<PostDetail post={likedPost} />);

      const likeButton = screen.getByRole('button', { name: /45/i });
      expect(likeButton).toHaveClass('bg-red-50', 'text-red-600');
    });
  });

  describe('Bookmark functionality', () => {
    it('should toggle bookmark state when bookmark button is clicked', async () => {
      const user = userEvent.setup();
      render(<PostDetail post={mockPost} />);

      const bookmarkButtons = screen.getAllByRole('button');
      const bookmarkButton = bookmarkButtons.find(btn => 
        btn.querySelector('path[d*="M5 5a2"]')
      );

      expect(bookmarkButton).toHaveClass('bg-gray-100', 'text-gray-600');

      await user.click(bookmarkButton!);

      expect(bookmarkButton).toHaveClass('bg-blue-50', 'text-blue-600');

      await user.click(bookmarkButton!);

      expect(bookmarkButton).toHaveClass('bg-gray-100', 'text-gray-600');
    });
  });

  describe('Share functionality', () => {
    it('should use native share API when available', async () => {
      const user = userEvent.setup();
      const mockShare = jest.fn().mockResolvedValue(undefined);
      (navigator.share as jest.Mock) = mockShare;

      render(<PostDetail post={mockPost} />);

      const shareButtons = screen.getAllByRole('button');
      const shareButton = shareButtons.find(btn => 
        btn.querySelector('path[d*="M8.684"]')
      );

      await user.click(shareButton!);

      expect(mockShare).toHaveBeenCalledWith({
        title: '휴머노이드 로봇의 미래',
        text: '휴머노이드 로봇 기술이 빠르게 발전하고 있습니다......',
        url: 'http://localhost/',
      });
    });

    it('should fallback to clipboard copy when native share is not available', async () => {
      const user = userEvent.setup();
      (navigator as any).share = undefined;
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      (navigator.clipboard.writeText as jest.Mock) = mockWriteText;

      render(<PostDetail post={mockPost} />);

      const shareButtons = screen.getAllByRole('button');
      const shareButton = shareButtons.find(btn => 
        btn.querySelector('path[d*="M8.684"]')
      );

      await user.click(shareButton!);

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith('http://localhost/');
        expect(window.alert).toHaveBeenCalledWith('링크가 클립보드에 복사되었습니다.');
      });
    });

    it('should handle share API errors gracefully', async () => {
      const user = userEvent.setup();
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const mockShare = jest.fn().mockRejectedValue(new Error('Share failed'));
      (navigator.share as jest.Mock) = mockShare;

      render(<PostDetail post={mockPost} />);

      const shareButtons = screen.getAllByRole('button');
      const shareButton = shareButtons.find(btn => 
        btn.querySelector('path[d*="M8.684"]')
      );

      await user.click(shareButton!);

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith('공유 실패:', expect.any(Error));
      });

      consoleLogSpy.mockRestore();
    });

    it('should handle clipboard copy errors gracefully', async () => {
      const user = userEvent.setup();
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      (navigator as any).share = undefined;
      const mockWriteText = jest.fn().mockRejectedValue(new Error('Copy failed'));
      (navigator.clipboard.writeText as jest.Mock) = mockWriteText;

      render(<PostDetail post={mockPost} />);

      const shareButtons = screen.getAllByRole('button');
      const shareButton = shareButtons.find(btn => 
        btn.querySelector('path[d*="M8.684"]')
      );

      await user.click(shareButton!);

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith('클립보드 복사 실패:', expect.any(Error));
      });

      consoleLogSpy.mockRestore();
    });
  });

  describe('Category variations', () => {
    it('should render general category with correct style', () => {
      const generalPost = { ...mockPost, category: 'general' as CommunityCategory };
      render(<PostDetail post={generalPost} />);

      const categoryElement = screen.getByText('일반');
      expect(categoryElement).toHaveClass('bg-gray-100', 'text-gray-700');
    });

    it('should render showcase category with correct style', () => {
      const showcasePost = { ...mockPost, category: 'showcase' as CommunityCategory };
      render(<PostDetail post={showcasePost} />);

      const categoryElement = screen.getByText('쇼케이스');
      expect(categoryElement).toHaveClass('bg-purple-100', 'text-purple-700');
    });

    it('should render question category with correct style', () => {
      const questionPost = { ...mockPost, category: 'question' as CommunityCategory };
      render(<PostDetail post={questionPost} />);

      const categoryElement = screen.getByText('질문');
      expect(categoryElement).toHaveClass('bg-yellow-100', 'text-yellow-700');
    });

    it('should render discussion category with correct style', () => {
      const discussionPost = { ...mockPost, category: 'discussion' as CommunityCategory };
      render(<PostDetail post={discussionPost} />);

      const categoryElement = screen.getByText('토론');
      expect(categoryElement).toHaveClass('bg-green-100', 'text-green-700');
    });

    it('should fallback to general style for unknown category', () => {
      const unknownPost = { ...mockPost, category: 'unknown' as any };
      render(<PostDetail post={unknownPost} />);

      const categoryElement = screen.getByText('일반');
      expect(categoryElement).toHaveClass('bg-gray-100', 'text-gray-700');
    });
  });

  describe('Edge cases', () => {
    it('should handle posts without tags', () => {
      const postWithoutTags = { ...mockPost, tags: [] };
      render(<PostDetail post={postWithoutTags} />);

      expect(screen.queryByText(/#/)).not.toBeInTheDocument();
    });

    it('should handle large numbers correctly', () => {
      const postWithLargeNumbers = {
        ...mockPost,
        viewCount: 1234567,
        likeCount: 9999,
        commentCount: 999,
      };
      render(<PostDetail post={postWithLargeNumbers} />);

      expect(screen.getByText('조회 1,234,567')).toBeInTheDocument();
      expect(screen.getByText('9999')).toBeInTheDocument();
      expect(screen.getByText('댓글 999')).toBeInTheDocument();
    });

    it('should handle long content correctly', () => {
      const longContent = 'A'.repeat(150);
      const postWithLongContent = { ...mockPost, content: longContent };
      render(<PostDetail post={postWithLongContent} />);

      expect(screen.getByText(longContent)).toBeInTheDocument();
    });
  });
});