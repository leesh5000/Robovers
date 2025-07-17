'use client';

import { useState, useEffect } from 'react';
import { Article, FilterOptions, SortOption } from '@/lib/types';
import ArticleCard from './ArticleCard';

interface MainFeedProps {
  initialArticles?: Article[];
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

// 목 데이터 (실제 구현시 API로 대체)
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'OpenAI의 새로운 휴머노이드 로봇 "Figure-01" 공개',
    content: '인공지능 선도기업 OpenAI가 휴머노이드 로봇 Figure-01을 공개했습니다...',
    excerpt: 'OpenAI가 Figure AI와 협력하여 개발한 휴머노이드 로봇이 일반 작업 환경에서 자연스럽게 대화하며 작업을 수행하는 모습을 선보였습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
    author: '로봇 뉴스팀',
    source: 'TechCrunch',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
    category: 'news',
    tags: ['OpenAI', 'Figure AI', '휴머노이드', '인공지능'],
    viewCount: 1250,
    likeCount: 89,
    commentCount: 23,
    isBookmarked: false
  },
  {
    id: '2',
    title: '테슬라 옵티머스, 공장 자동화에서 첫 실전 투입',
    content: '테슬라의 휴머노이드 로봇 옵티머스가 실제 생산 공장에서...',
    excerpt: '테슬라가 자사 공장에서 옵티머스 로봇을 활용한 자동화 시스템을 본격 가동하기 시작했다고 발표했습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?w=600&h=400&fit=crop',
    author: '김테크',
    source: 'Tesla Blog',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5시간 전
    category: 'company-update',
    tags: ['테슬라', '옵티머스', '공장 자동화', '생산성'],
    viewCount: 890,
    likeCount: 67,
    commentCount: 15,
    isBookmarked: true
  },
  {
    id: '3',
    title: '보스턴 다이나믹스 아틀라스, 역대급 파쿠르 영상 공개',
    content: '보스턴 다이나믹스의 휴머노이드 로봇 아틀라스가...',
    excerpt: '최신 버전의 아틀라스가 복잡한 장애물 코스를 뛰어넘고, 백플립까지 선보이는 놀라운 영상이 공개되었습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=600&h=400&fit=crop',
    author: '로봇공학연구소',
    source: 'Boston Dynamics',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1일 전
    category: 'tech-review',
    tags: ['보스턴다이나믹스', '아틀라스', '파쿠르', '모빌리티'],
    viewCount: 2100,
    likeCount: 156,
    commentCount: 34,
    isBookmarked: false
  },
  {
    id: '4',
    title: 'MIT 연구진, 소프트 로보틱스 분야 획기적 발견',
    content: 'MIT 연구팀이 새로운 소재를 활용한 소프트 로봇...',
    excerpt: '기존 경직된 로봇과 달리 인간의 근육과 유사한 움직임을 구현할 수 있는 새로운 소프트 로보틱스 기술이 개발되었습니다.',
    author: '과학기술부',
    source: 'MIT News',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
    category: 'research',
    tags: ['MIT', '소프트로보틱스', '생체모방', '연구'],
    viewCount: 745,
    likeCount: 42,
    commentCount: 8,
    isBookmarked: false
  }
];

export default function MainFeed({ 
  initialArticles = mockArticles, 
  onLoadMore, 
  isLoading = false, 
  hasMore = true 
}: MainFeedProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'latest'
  });

  const handleLike = (articleId: string) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, likeCount: article.likeCount + 1 }
        : article
    ));
  };

  const handleBookmark = (articleId: string) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, isBookmarked: !article.isBookmarked }
        : article
    ));
  };

  const handleSortChange = (sortBy: SortOption) => {
    setFilters(prev => ({ ...prev, sortBy }));
    
    // 정렬 로직
    const sortedArticles = [...articles].sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'popular':
          return b.viewCount - a.viewCount;
        case 'trending':
          return b.likeCount - a.likeCount;
        case 'commented':
          return b.commentCount - a.commentCount;
        default:
          return 0;
      }
    });
    
    setArticles(sortedArticles);
  };

  const getSortLabel = (sortBy: SortOption) => {
    const labels = {
      'latest': '최신순',
      'popular': '인기순',
      'trending': '트렌딩',
      'commented': '댓글순'
    };
    return labels[sortBy];
  };

  return (
    <div className="space-y-6">
      {/* 필터 및 정렬 헤더 */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            최신 로봇 뉴스 & 정보
          </h2>
          <span className="text-sm text-gray-500">
            {articles.length}개의 게시물
          </span>
        </div>

        {/* 정렬 옵션 */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">정렬:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="trending">트렌딩</option>
            <option value="commented">댓글순</option>
          </select>
        </div>
      </div>

      {/* 게시물 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onLike={handleLike}
            onBookmark={handleBookmark}
          />
        ))}
      </div>

      {/* 로딩 스켈레톤 */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 더 보기 버튼 */}
      {hasMore && !isLoading && (
        <div className="flex justify-center pt-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            더 많은 게시물 보기
          </button>
        </div>
      )}

      {/* 끝에 도달했을 때 */}
      {!hasMore && !isLoading && articles.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">모든 게시물을 확인했습니다.</p>
        </div>
      )}

      {/* 게시물이 없을 때 */}
      {articles.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            아직 게시물이 없습니다
          </h3>
          <p className="text-gray-500">
            새로운 로봇 소식이 업데이트되면 이곳에 표시됩니다.
          </p>
        </div>
      )}
    </div>
  );
}