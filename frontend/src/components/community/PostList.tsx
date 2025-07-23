'use client';

import { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { CommunityPost, CommunityCategory, SortOption } from '@/lib/types';
import { getDummyPosts } from '@/lib/dummy-data';

interface PostListProps {
  category: CommunityCategory | 'all';
  sortBy: SortOption;
  searchQuery: string;
}

export default function PostList({ category, sortBy, searchQuery }: PostListProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 더미 데이터 로드 시뮬레이션
    setLoading(true);
    setTimeout(() => {
      let filteredPosts = getDummyPosts();

      // 카테고리 필터링
      if (category !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === category);
      }

      // 검색 필터링
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredPosts = filteredPosts.filter(
          post =>
            post.title.toLowerCase().includes(query) ||
            post.content.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      // 정렬
      switch (sortBy) {
        case 'latest':
          filteredPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case 'popular':
          filteredPosts.sort((a, b) => b.likeCount - a.likeCount);
          break;
        case 'trending':
          // 트렌딩: 최근 24시간 내 작성된 글 중 조회수가 높은 순
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          filteredPosts = filteredPosts.filter(post => post.createdAt > oneDayAgo);
          filteredPosts.sort((a, b) => b.viewCount - a.viewCount);
          break;
        case 'commented':
          filteredPosts.sort((a, b) => b.commentCount - a.commentCount);
          break;
      }

      setPosts(filteredPosts);
      setLoading(false);
    }, 500);
  }, [category, sortBy, searchQuery]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
            <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
            <div className="w-5/6 h-4 bg-gray-200 rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          게시글이 없습니다
        </h3>
        <p className="text-gray-500">
          {searchQuery
            ? `"${searchQuery}"에 대한 검색 결과가 없습니다`
            : '첫 번째 게시글을 작성해보세요!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}