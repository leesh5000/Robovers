'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/types';

interface ArticleCardProps {
  article: Article;
  onLike?: (articleId: string) => void;
  onBookmark?: (articleId: string) => void;
}

export default function ArticleCard({ article, onLike, onBookmark }: ArticleCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getCategoryLabel = (category: string) => {
    const labels = {
      'news': '뉴스',
      'tech-review': '기술 리뷰',
      'company-update': '기업 소식',
      'research': '연구',
      'innovation': '혁신'
    };
    return labels[category as keyof typeof labels] || '기타';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'news': 'bg-blue-100 text-blue-800',
      'tech-review': 'bg-green-100 text-green-800',
      'company-update': 'bg-purple-100 text-purple-800',
      'research': 'bg-orange-100 text-orange-800',
      'innovation': 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* 썸네일 이미지 */}
      {article.imageUrl && !imageError && (
        <div className="relative h-48 w-full overflow-hidden">
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
          
          {/* 카테고리 배지 */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.category)}`}>
              {getCategoryLabel(article.category)}
            </span>
          </div>

          {/* 북마크 버튼 */}
          <button
            onClick={() => onBookmark?.(article.id)}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
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
      )}

      {/* 콘텐츠 */}
      <div className="p-6">
        {/* 카테고리 (이미지가 없는 경우) */}
        {(!article.imageUrl || imageError) && (
          <div className="mb-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.category)}`}>
              {getCategoryLabel(article.category)}
            </span>
          </div>
        )}

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
            <span className="font-medium">{article.source}</span>
            {isClient ? (
              <span>{formatPublishedDate(article.publishedAt)}</span>
            ) : (
              <span suppressHydrationWarning>{article.publishedAt.toLocaleDateString('ko-KR')}</span>
            )}
            <span>조회 {formatCount(article.viewCount)}</span>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center space-x-3">
            {/* 좋아요 버튼 */}
            <button
              onClick={() => onLike?.(article.id)}
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
              <span>{formatCount(article.likeCount)}</span>
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
              <span>{formatCount(article.commentCount)}</span>
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
}