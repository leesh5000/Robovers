import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import PostCard from '../PostCard';
import { CommunityPost, CommunityCategory } from '@/lib/types';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();

const mockPost: CommunityPost = {
  id: '1',
  title: '휴머노이드 로봇의 미래에 대한 고찰',
  content: '최근 휴머노이드 로봇 기술이 빠르게 발전하면서 우리의 일상생활에 큰 변화가 예상됩니다. 이 글에서는 휴머노이드 로봇이 가져올 미래의 변화에 대해 살펴보겠습니다.',
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

describe('PostCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  describe('Rendering', () => {
    it('should render post title', () => {
      render(<PostCard post={mockPost} />);

      expect(screen.getByText('휴머노이드 로봇의 미래에 대한 고찰')).toBeInTheDocument();
    });

    it('should render content preview with line clamp', () => {
      render(<PostCard post={mockPost} />);

      const content = screen.getByText(/최근 휴머노이드 로봇 기술이/);
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('line-clamp-3');
    });

    it('should render category with correct style', () => {
      render(<PostCard post={mockPost} />);

      const categoryElement = screen.getByText('기술');
      expect(categoryElement).toHaveClass('bg-blue-100', 'text-blue-700');
    });

    it('should render author information', () => {
      render(<PostCard post={mockPost} />);

      expect(screen.getByText('techuser')).toBeInTheDocument();
      expect(screen.getByAltText('techuser')).toBeInTheDocument();
    });

    it('should render author initial when avatar is not provided', () => {
      const postWithoutAvatar = {
        ...mockPost,
        author: { ...mockPost.author, avatar: undefined },
      };
      render(<PostCard post={postWithoutAvatar} />);

      expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('should render verified badge for verified authors', () => {
      render(<PostCard post={mockPost} />);

      const verifiedBadge = screen.getByRole('img', { hidden: true });
      expect(verifiedBadge).toBeInTheDocument();
    });

    it('should not render verified badge for unverified authors', () => {
      const unverifiedPost = {
        ...mockPost,
        author: { ...mockPost.author, isVerified: false },
      };
      render(<PostCard post={unverifiedPost} />);

      const badges = screen.queryAllByRole('img', { hidden: true });
      expect(badges).toHaveLength(0);
    });

    it('should render pinned indicator for pinned posts', () => {
      const pinnedPost = { ...mockPost, isPinned: true };
      render(<PostCard post={pinnedPost} />);

      expect(screen.getByText('고정됨')).toBeInTheDocument();
    });

    it('should not render pinned indicator for regular posts', () => {
      render(<PostCard post={mockPost} />);

      expect(screen.queryByText('고정됨')).not.toBeInTheDocument();
    });

    it('should render tags', () => {
      render(<PostCard post={mockPost} />);

      expect(screen.getByText('#휴머노이드')).toBeInTheDocument();
      expect(screen.getByText('#로봇')).toBeInTheDocument();
      expect(screen.getByText('#AI')).toBeInTheDocument();
    });

    it('should not render tags section when no tags', () => {
      const postWithoutTags = { ...mockPost, tags: [] };
      render(<PostCard post={postWithoutTags} />);

      expect(screen.queryByText(/#/)).not.toBeInTheDocument();
    });

    it('should render statistics', () => {
      render(<PostCard post={mockPost} />);

      expect(screen.getByText('1234')).toBeInTheDocument(); // viewCount
      expect(screen.getByText('45')).toBeInTheDocument(); // likeCount
      expect(screen.getByText('12')).toBeInTheDocument(); // commentCount
    });

    it('should render liked state correctly', () => {
      const likedPost = { ...mockPost, isLiked: true };
      render(<PostCard post={likedPost} />);

      // Check if heart icon has correct styling
      const paths = screen.getAllByRole('img', { hidden: true });
      const heartPath = paths.find(path => 
        path.getAttribute('d')?.includes('M4.318 6.318')
      );
      
      expect(heartPath?.parentElement).toHaveClass('text-red-500', 'fill-current');
    });

    it('should render relative time', () => {
      render(<PostCard post={mockPost} />);

      const expectedTime = formatDistanceToNow(mockPost.createdAt, {
        addSuffix: true,
        locale: ko,
      });
      expect(screen.getByText(expectedTime)).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should navigate to post detail on card click', async () => {
      const user = userEvent.setup();
      render(<PostCard post={mockPost} />);

      const card = screen.getByRole('article');
      await user.click(card);

      expect(mockPush).toHaveBeenCalledWith('/community/1');
    });

    it('should have hover effect class', () => {
      render(<PostCard post={mockPost} />);

      const card = screen.getByRole('article');
      expect(card).toHaveClass('hover:shadow-md', 'cursor-pointer');
    });
  });

  describe('Category variations', () => {
    it('should render general category correctly', () => {
      const generalPost = { ...mockPost, category: 'general' as CommunityCategory };
      render(<PostCard post={generalPost} />);

      const categoryElement = screen.getByText('일반');
      expect(categoryElement).toHaveClass('bg-gray-100', 'text-gray-700');
    });

    it('should render showcase category correctly', () => {
      const showcasePost = { ...mockPost, category: 'showcase' as CommunityCategory };
      render(<PostCard post={showcasePost} />);

      const categoryElement = screen.getByText('쇼케이스');
      expect(categoryElement).toHaveClass('bg-purple-100', 'text-purple-700');
    });

    it('should render question category correctly', () => {
      const questionPost = { ...mockPost, category: 'question' as CommunityCategory };
      render(<PostCard post={questionPost} />);

      const categoryElement = screen.getByText('질문');
      expect(categoryElement).toHaveClass('bg-yellow-100', 'text-yellow-700');
    });

    it('should render discussion category correctly', () => {
      const discussionPost = { ...mockPost, category: 'discussion' as CommunityCategory };
      render(<PostCard post={discussionPost} />);

      const categoryElement = screen.getByText('토론');
      expect(categoryElement).toHaveClass('bg-green-100', 'text-green-700');
    });

    it('should fallback to general style for unknown category', () => {
      const unknownPost = { ...mockPost, category: 'unknown' as CommunityCategory };
      render(<PostCard post={unknownPost} />);

      const categoryElement = screen.getByText('일반');
      expect(categoryElement).toHaveClass('bg-gray-100', 'text-gray-700');
    });
  });

  describe('Edge cases', () => {
    it('should handle long title with line clamp', () => {
      const longTitle = 'A'.repeat(100);
      const postWithLongTitle = { ...mockPost, title: longTitle };
      render(<PostCard post={postWithLongTitle} />);

      const titleElement = screen.getByText(longTitle);
      expect(titleElement).toHaveClass('line-clamp-2');
    });

    it('should handle many tags', () => {
      const manyTags = Array.from({ length: 10 }, (_, i) => `tag${i}`);
      const postWithManyTags = { ...mockPost, tags: manyTags };
      render(<PostCard post={postWithManyTags} />);

      manyTags.forEach(tag => {
        expect(screen.getByText(`#${tag}`)).toBeInTheDocument();
      });
    });

    it('should handle zero statistics', () => {
      const postWithZeroStats = {
        ...mockPost,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
      };
      render(<PostCard post={postWithZeroStats} />);

      const zeros = screen.getAllByText('0');
      expect(zeros).toHaveLength(3);
    });

    it('should handle large numbers in statistics', () => {
      const postWithLargeNumbers = {
        ...mockPost,
        viewCount: 123456,
        likeCount: 9999,
        commentCount: 999,
      };
      render(<PostCard post={postWithLargeNumbers} />);

      expect(screen.getByText('123456')).toBeInTheDocument();
      expect(screen.getByText('9999')).toBeInTheDocument();
      expect(screen.getByText('999')).toBeInTheDocument();
    });

    it('should handle very short username', () => {
      const shortUsernamePost = {
        ...mockPost,
        author: { ...mockPost.author, username: 'a' },
      };
      render(<PostCard post={shortUsernamePost} />);

      expect(screen.getByText('a')).toBeInTheDocument();
    });

    it('should handle very recent post time', () => {
      const recentPost = {
        ...mockPost,
        createdAt: new Date(),
      };
      render(<PostCard post={recentPost} />);

      // formatDistanceToNow will return something like "less than a minute ago" in Korean
      const timeElement = screen.getByText(/전$/);
      expect(timeElement).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have article role', () => {
      render(<PostCard post={mockPost} />);

      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<PostCard post={mockPost} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent(mockPost.title);
    });

    it('should have time element for creation date', () => {
      render(<PostCard post={mockPost} />);

      const timeElement = document.querySelector('time');
      expect(timeElement).toBeInTheDocument();
    });
  });
});