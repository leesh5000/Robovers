'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Article, FilterOptions, SortOption } from '@/lib/types';
import ArticleCard from './ArticleCard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';

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
    title: '엔비디아, 휴머노이드 로봇 전용 AI 칩 "Thor" 공개... 연산 성능 800% 향상',
    content: '엔비디아가 CES 2025에서 휴머노이드 로봇 전용으로 설계된 새로운 AI 칩 "Thor"를 공개했습니다. 이 칩은 기존 제품 대비 8배 향상된 연산 성능을 자랑하며, 실시간 환경 인식과 자연스러운 움직임 생성을 동시에 처리할 수 있습니다...',
    excerpt: '엔비디아가 휴머노이드 로봇의 두뇌 역할을 할 차세대 AI 칩을 발표했습니다. Figure, Tesla, Agility Robotics 등 주요 로봇 기업들이 이미 채택을 확정했습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
    author: '이준호 기자',
    source: 'Reuters',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
    category: 'news',
    tags: ['엔비디아', 'AI칩', 'Thor', '휴머노이드', 'CES2025'],
    viewCount: 15420,
    likeCount: 892,
    commentCount: 234,
    isBookmarked: false
  },
  {
    id: '2',
    title: '현대차-보스턴다이나믹스, 아마존 물류센터에 로봇 1만대 공급 계약',
    content: '현대자동차그룹이 인수한 보스턴다이나믹스가 아마존과 대규모 로봇 공급 계약을 체결했습니다. 이번 계약은 총 1만대의 물류 로봇을 3년에 걸쳐 공급하는 내용으로, 계약 규모는 약 2조원에 달합니다...',
    excerpt: '보스턴다이나믹스의 4족 보행 로봇 "Spot"과 물류 전용 로봇 "Stretch"가 아마존의 글로벌 물류센터에 대규모로 도입됩니다.',
    imageUrl: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&h=400&fit=crop',
    author: '김민수 기자',
    source: 'Bloomberg',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5시간 전
    category: 'company-update',
    tags: ['현대차', '보스턴다이나믹스', '아마존', '물류로봇', 'Spot'],
    viewCount: 8920,
    likeCount: 567,
    commentCount: 145,
    isBookmarked: true
  },
  {
    id: '3',
    title: '중국 유니트리, 휴머노이드 로봇 "H1" 가격 파괴... 3천만원대 출시',
    content: '중국의 로봇 기업 유니트리(Unitree)가 휴머노이드 로봇 H1을 3천만원대의 파격적인 가격에 출시한다고 발표했습니다. 이는 기존 휴머노이드 로봇 가격의 1/10 수준으로, 업계에 큰 충격을 주고 있습니다...',
    excerpt: '시속 12km 달리기, 360도 비전 시스템, 자율 내비게이션 기능을 갖춘 H1이 파격적인 가격으로 시장에 진입합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    author: 'Sarah Chen',
    source: 'TechCrunch',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1일 전
    category: 'tech-review',
    tags: ['유니트리', 'H1', '휴머노이드', '가격파괴', '중국'],
    viewCount: 21050,
    likeCount: 1567,
    commentCount: 342,
    isBookmarked: false
  },
  {
    id: '4',
    title: 'MIT-하버드 공동연구팀, 인공 근육 소재로 90% 에너지 효율 달성',
    content: 'MIT와 하버드 대학의 공동 연구팀이 생체모방 인공 근육 소재를 개발하여 기존 모터 대비 90% 높은 에너지 효율을 달성했다고 발표했습니다. 이 기술은 차세대 휴머노이드 로봇의 핵심 부품이 될 것으로 기대됩니다...',
    excerpt: '전기활성 폴리머를 활용한 새로운 인공 근육은 인간 근육과 유사한 수축-이완 패턴을 구현하며, 무게는 기존 모터의 1/5 수준입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=800&h=400&fit=crop',
    author: 'Dr. James Wilson',
    source: 'Nature Robotics',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
    category: 'research',
    tags: ['MIT', '하버드', '인공근육', '소프트로보틱스', '에너지효율'],
    viewCount: 7456,
    likeCount: 423,
    commentCount: 89,
    isBookmarked: false
  }
];

export default function MainFeed({ 
  initialArticles, 
  onLoadMore, 
  isLoading = false, 
  hasMore = true 
}: MainFeedProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>(initialArticles || mockArticles);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'latest'
  });

  // initialArticles가 변경될 때 articles 상태 업데이트
  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) {
      setArticles(initialArticles);
    }
  }, [initialArticles]);

  // 무한 스크롤 훅 사용
  const loadMoreRef = useInfiniteScroll({
    onLoadMore: onLoadMore || (() => {}),
    hasMore,
    isLoading,
    threshold: 0.1,
    rootMargin: '100px',
  });

  const handleLike = useCallback((articleId: string) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, likeCount: article.likeCount + 1 }
        : article
    ));
  }, []);

  const handleBookmark = useCallback((articleId: string) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, isBookmarked: !article.isBookmarked }
        : article
    ));
  }, []);

  const handleCardClick = useCallback((articleId: string) => {
    router.push(`/articles/${articleId}`);
  }, [router]);

  const handleSortChange = useCallback((sortBy: SortOption) => {
    setFilters(prev => ({ ...prev, sortBy }));
  }, []);

  // 정렬된 게시물 목록을 메모이제이션
  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      switch (filters.sortBy) {
        case 'latest':
          // Date 객체가 문자열로 전달될 수 있으므로 안전하게 변환
          const dateA = a.publishedAt instanceof Date ? a.publishedAt : new Date(a.publishedAt);
          const dateB = b.publishedAt instanceof Date ? b.publishedAt : new Date(b.publishedAt);
          return dateB.getTime() - dateA.getTime();
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
  }, [articles, filters.sortBy]);

  // 정렬 옵션을 드롭다운용으로 변환 (메모이제이션)
  const sortOptions: DropdownOption[] = useMemo(() => [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'trending', label: '트렌딩' },
    { value: 'commented', label: '댓글순' }
  ], []);

  return (
    <div className="space-y-6">
      {/* 필터 및 정렬 헤더 */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            최신 로봇 뉴스 & 정보
          </h2>
          <span className="text-sm text-gray-500">
            {sortedArticles.length}개의 게시물
          </span>
        </div>

        {/* 정렬 옵션 */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">정렬:</span>
          <Dropdown
            options={sortOptions}
            value={filters.sortBy}
            onChange={(value) => handleSortChange(value as SortOption)}
            size="sm"
            className="w-32"
          />
        </div>
      </div>

      {/* 게시물 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedArticles.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onClick={handleCardClick}
            priority={index < 2} // 첫 2개 이미지에 priority 설정
          />
        ))}
      </div>

      {/* 로딩 스켈레톤 */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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

      {/* 무한 스크롤 트리거 요소 */}
      {hasMore && (
        <div 
          ref={loadMoreRef}
          className="flex justify-center pt-8 pb-4"
        >
          {!isLoading ? (
            <div className="text-gray-500 text-sm">
              스크롤하여 더 많은 게시물 보기
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>
      )}

      {/* 끝에 도달했을 때 */}
      {!hasMore && !isLoading && articles.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">모든 게시물을 확인했습니다.</p>
        </div>
      )}

      {/* 게시물이 없을 때 */}
      {sortedArticles.length === 0 && !isLoading && (
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