import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PostList from '../PostList';
import { CommunityPost } from '@/lib/types';

// Mock dependencies
jest.mock('../PostCard', () => {
  return function MockPostCard({ post }: { post: CommunityPost }) {
    return (
      <div data-testid="post-card">
        {post.title} - {post.category}
      </div>
    );
  };
});

jest.mock('@/lib/dummy-data', () => ({
  getDummyPosts: jest.fn(),
}));

import { getDummyPosts } from '@/lib/dummy-data';

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    title: '최신 게시글',
    content: '최신 내용입니다',
    category: 'technical',
    tags: ['tech', 'robot'],
    author: {
      id: '1',
      username: 'user1',
      email: 'user1@example.com',
      isVerified: true,
      joinedAt: new Date('2023-01-01'),
    },
    viewCount: 100,
    likeCount: 10,
    commentCount: 5,
    isPinned: false,
    isLiked: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    title: '인기 게시글',
    content: '인기 있는 내용입니다',
    category: 'general',
    tags: ['popular'],
    author: {
      id: '2',
      username: 'user2',
      email: 'user2@example.com',
      isVerified: false,
      joinedAt: new Date('2023-02-01'),
    },
    viewCount: 500,
    likeCount: 50,
    commentCount: 20,
    isPinned: false,
    isLiked: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    title: '트렌딩 게시글',
    content: '트렌딩 내용입니다',
    category: 'showcase',
    tags: ['trending', 'robot'],
    author: {
      id: '3',
      username: 'user3',
      email: 'user3@example.com',
      isVerified: true,
      joinedAt: new Date('2023-03-01'),
    },
    viewCount: 1000,
    likeCount: 30,
    commentCount: 50,
    isPinned: true,
    isLiked: true,
    createdAt: new Date(), // Today
    updatedAt: new Date(),
  },
];

describe('PostList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (getDummyPosts as jest.Mock).mockReturnValue(mockPosts);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Loading state', () => {
    it('should show loading skeletons initially', () => {
      render(
        <PostList category="all" sortBy="latest" searchQuery="" />
      );

      const skeletons = screen.getAllByTestId((content, element) => {
        return element?.className?.includes('animate-pulse') || false;
      });
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should hide loading state after data loads', async () => {
      render(
        <PostList category="all" sortBy="latest" searchQuery="" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(screen.queryByTestId(/animate-pulse/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Category filtering', () => {
    it('should show all posts when category is "all"', async () => {
      render(
        <PostList category="all" sortBy="latest" searchQuery="" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const postCards = screen.getAllByTestId('post-card');
        expect(postCards).toHaveLength(3);
      });
    });

    it('should filter posts by technical category', async () => {
      render(
        <PostList category="technical" sortBy="latest" searchQuery="" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const postCards = screen.getAllByTestId('post-card');
        expect(postCards).toHaveLength(1);
        expect(postCards[0]).toHaveTextContent('최신 게시글');
      });
    });

    it('should filter posts by general category', async () => {
      render(
        <PostList category="general" sortBy="latest" searchQuery="" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const postCards = screen.getAllByTestId('post-card');
        expect(postCards).toHaveLength(1);
        expect(postCards[0]).toHaveTextContent('인기 게시글');
      });
    });

    it('should filter posts by showcase category', async () => {
      render(
        <PostList category="showcase" sortBy="latest" searchQuery="" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const postCards = screen.getAllByTestId('post-card');
        expect(postCards).toHaveLength(1);
        expect(postCards[0]).toHaveTextContent('트렌딩 게시글');
      });
    });
  });

  describe('Search functionality', () => {
    it('should filter posts by search query in title', async () => {
      render(
        <PostList category="all" sortBy="latest" searchQuery="최신" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const postCards = screen.getAllByTestId('post-card');
        expect(postCards).toHaveLength(1);
        expect(postCards[0]).toHaveTextContent('최신 게시글');
      });
    });

    it('should filter posts by search query in content', async () => {
      render(
        <PostList category="all" sortBy="latest" searchQuery="인기 있는" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const postCards = screen.getAllByTestId('post-card');
        expect(postCards).toHaveLength(1);
        expect(postCards[0]).toHaveTextContent('인기 게시글');
      });
    });

    it('should filter posts by search query in tags', async () => {
      render(
        <PostList category="all" sortBy="latest" searchQuery="robot" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const postCards = screen.getAllByTestId('post-card');
        expect(postCards).toHaveLength(2);
      });
    });

    it('should be case insensitive in search', async () => {
      render(
        <PostList category="all" sortBy="latest" searchQuery="TRENDING" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const postCards = screen.getAllByTestId('post-card');
        expect(postCards).toHaveLength(1);
        expect(postCards[0]).toHaveTextContent('트렌딩 게시글');
      });
    });
  });

  describe('Sorting functionality', () => {
    it('should sort by latest (newest first)', async () => {
      render(
        <PostList category="all" sortBy="latest" searchQuery="" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const postCards = screen.getAllByTestId('post-card');
        expect(postCards[0]).toHaveTextContent('트렌딩 게시글');
        expect(postCards[1]).toHaveTextContent('최신 게시글');
        expect(postCards[2]).toHaveTextContent('인기 게시글');
      });
    });

    it('should sort by popular (most likes)', async () => {
      render(
        <PostList category="all" sortBy="popular" searchQuery="" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const postCards = screen.getAllByTestId('post-card');
        expect(postCards[0]).toHaveTextContent('인기 게시글'); // 50 likes
        expect(postCards[1]).toHaveTextContent('트렌딩 게시글'); // 30 likes
        expect(postCards[2]).toHaveTextContent('최신 게시글'); // 10 likes
      });
    });

    it('should sort by commented (most comments)', async () => {
      render(
        <PostList category="all" sortBy="commented" searchQuery="" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const postCards = screen.getAllByTestId('post-card');
        expect(postCards[0]).toHaveTextContent('트렌딩 게시글'); // 50 comments
        expect(postCards[1]).toHaveTextContent('인기 게시글'); // 20 comments
        expect(postCards[2]).toHaveTextContent('최신 게시글'); // 5 comments
      });
    });

    it('should filter and sort trending posts (last 24h, most views)', async () => {
      render(
        <PostList category="all" sortBy="trending" searchQuery="" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const postCards = screen.getAllByTestId('post-card');
        // Only the post created today should show
        expect(postCards).toHaveLength(1);
        expect(postCards[0]).toHaveTextContent('트렌딩 게시글');
      });
    });
  });

  describe('Empty states', () => {
    it('should show empty state when no posts', async () => {
      (getDummyPosts as jest.Mock).mockReturnValue([]);
      
      render(
        <PostList category="all" sortBy="latest" searchQuery="" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(screen.getByText('게시글이 없습니다')).toBeInTheDocument();
        expect(screen.getByText('첫 번째 게시글을 작성해보세요!')).toBeInTheDocument();
      });
    });

    it('should show search empty state when no search results', async () => {
      render(
        <PostList category="all" sortBy="latest" searchQuery="nonexistent" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(screen.getByText('게시글이 없습니다')).toBeInTheDocument();
        expect(screen.getByText('"nonexistent"에 대한 검색 결과가 없습니다')).toBeInTheDocument();
      });
    });

    it('should show empty state when category has no posts', async () => {
      render(
        <PostList category="question" sortBy="latest" searchQuery="" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(screen.getByText('게시글이 없습니다')).toBeInTheDocument();
      });
    });
  });

  describe('Combined filters', () => {
    it('should apply category and search filters together', async () => {
      render(
        <PostList category="technical" sortBy="latest" searchQuery="robot" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const postCards = screen.getAllByTestId('post-card');
        expect(postCards).toHaveLength(1);
        expect(postCards[0]).toHaveTextContent('최신 게시글');
      });
    });

    it('should apply all filters: category, search, and sort', async () => {
      const allCategoryPosts: CommunityPost[] = [
        ...mockPosts,
        {
          id: '4',
          title: '또 다른 기술 게시글',
          content: '기술 관련 내용',
          category: 'technical',
          tags: ['tech'],
          author: {
            id: '4',
            username: 'user4',
            email: 'user4@example.com',
            isVerified: false,
            joinedAt: new Date('2023-04-01'),
          },
          viewCount: 200,
          likeCount: 25,
          commentCount: 10,
          isPinned: false,
          isLiked: false,
          createdAt: new Date('2024-01-18'),
          updatedAt: new Date('2024-01-18'),
        },
      ];

      (getDummyPosts as jest.Mock).mockReturnValue(allCategoryPosts);

      render(
        <PostList category="technical" sortBy="popular" searchQuery="tech" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const postCards = screen.getAllByTestId('post-card');
        expect(postCards).toHaveLength(2);
        // Should be sorted by likes
        expect(postCards[0]).toHaveTextContent('또 다른 기술 게시글'); // 25 likes
        expect(postCards[1]).toHaveTextContent('최신 게시글'); // 10 likes
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty search query', async () => {
      render(
        <PostList category="all" sortBy="latest" searchQuery="" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const postCards = screen.getAllByTestId('post-card');
        expect(postCards).toHaveLength(3);
      });
    });

    it('should handle whitespace search query', async () => {
      render(
        <PostList category="all" sortBy="latest" searchQuery="   " />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const postCards = screen.getAllByTestId('post-card');
        expect(postCards).toHaveLength(3);
      });
    });

    it('should re-fetch when props change', async () => {
      const { rerender } = render(
        <PostList category="all" sortBy="latest" searchQuery="" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(screen.getAllByTestId('post-card')).toHaveLength(3);
      });

      rerender(
        <PostList category="technical" sortBy="latest" searchQuery="" />
      );

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(screen.getAllByTestId('post-card')).toHaveLength(1);
      });
    });
  });
});