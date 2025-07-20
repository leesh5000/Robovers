'use client';

import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/types';

interface ArticleCardProps {
  article: Article;
  onLike?: (articleId: string) => void;
  onBookmark?: (articleId: string) => void;
  onClick?: (articleId: string) => void;
}

const ArticleCard = memo(function ArticleCard({ article, onLike, onBookmark, onClick }: ArticleCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const categoryConfig = useMemo(() => {
    const labels = {
      'news': '뉴스',
      'tech-review': '기술 리뷰',
      'company-update': '기업 소식',
      'research': '연구',
      'innovation': '혁신'
    };
    const colors = {
      'news': 'bg-blue-100 text-blue-800',
      'tech-review': 'bg-green-100 text-green-800',
      'company-update': 'bg-purple-100 text-purple-800',
      'research': 'bg-orange-100 text-orange-800',
      'innovation': 'bg-red-100 text-red-800'
    };
    const gradients = {
      'news': 'from-blue-400 to-blue-600',
      'tech-review': 'from-green-400 to-green-600',
      'company-update': 'from-purple-400 to-purple-600',
      'research': 'from-orange-400 to-orange-600',
      'innovation': 'from-red-400 to-red-600'
    };
    
    return {
      label: labels[article.category as keyof typeof labels] || '기타',
      color: colors[article.category as keyof typeof colors] || 'bg-gray-100 text-gray-800',
      gradient: gradients[article.category as keyof typeof gradients] || 'from-gray-400 to-gray-600'
    };
  }, [article.category]);

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'news':
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      case 'tech-review':
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'company-update':
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'research':
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatPublishedDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return '방금 전';
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // 버튼이나 링크 클릭이 아닌 경우에만 onClick 호출
    if ((e.target as HTMLElement).closest('button, a')) {
      return;
    }
    onClick?.(article.id);
  }, [onClick, article.id]);

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(article.id);
  }, [onLike, article.id]);

  const handleBookmark = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark?.(article.id);
  }, [onBookmark, article.id]);

  return (
    <article 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* 썸네일 이미지 */}
      <div className="relative h-48 w-full overflow-hidden">
        {article.imageUrl && !imageError ? (
          <Link href={`/articles/${article.id}`}>
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className={`object-cover hover:scale-105 transition-transform duration-200 ${
                isImageLoading ? 'animate-pulse bg-gray-200' : ''
              }`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                setImageError(true);
                setIsImageLoading(false);
              }}
            />
          </Link>
        ) : (
          /* 기본 이미지 */
          <Link href={`/articles/${article.id}`}>
            <div className={`relative h-full w-full bg-gradient-to-br ${categoryConfig.gradient} hover:opacity-90 transition-opacity`}>
              {/* 패턴 오버레이 */}
              <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>
              
              {/* 아이콘과 텍스트 */}
              <div className="relative h-full flex flex-col items-center justify-center text-white">
                <div className="opacity-90">
                  {getCategoryIcon(article.category)}
                </div>
                <p className="mt-3 text-sm font-semibold uppercase tracking-wide opacity-90">
                  {categoryConfig.label}
                </p>
              </div>
            </div>
          </Link>
        )}
        
        {/* 카테고리 배지 */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryConfig.color}`}>
            {categoryConfig.label}
          </span>
        </div>

        {/* 북마크 버튼 */}
        <button
          onClick={handleBookmark}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          aria-label="북마크"
        >
          <svg
            className={`h-4 w-4 ${article.isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-600'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="p-6">

        {/* 제목 */}
        <Link href={`/articles/${article.id}`}>
          <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {article.title}
          </h2>
        </Link>

        {/* 요약 */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* 태그 */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="text-xs text-gray-400">
                +{article.tags.length - 3}개
              </span>
            )}
          </div>
        )}

        {/* 메타 정보 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="font-medium">{article.author}{article.source && ` · ${article.source}`}</span>
            {isClient ? (
              <span>{formatPublishedDate(article.publishedAt)}</span>
            ) : (
              <span suppressHydrationWarning>{article.publishedAt.toLocaleDateString('ko-KR')}</span>
            )}
            <span>조회 {article.viewCount.toLocaleString()}</span>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center space-x-3">
            {/* 좋아요 버튼 */}
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 hover:text-red-500 transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{article.likeCount}</span>
            </button>

            {/* 댓글 버튼 */}
            <Link
              href={`/articles/${article.id}#comments`}
              className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{article.commentCount}</span>
            </Link>

            {/* 공유 버튼 */}
            <button className="flex items-center hover:text-gray-700 transition-colors">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});

export default ArticleCard;