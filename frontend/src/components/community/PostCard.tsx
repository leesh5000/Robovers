'use client';

import { CommunityPost } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PostCardProps {
  post: CommunityPost;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  general: { bg: 'bg-gray-100', text: 'text-gray-700' },
  technical: { bg: 'bg-blue-100', text: 'text-blue-700' },
  showcase: { bg: 'bg-purple-100', text: 'text-purple-700' },
  question: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  discussion: { bg: 'bg-green-100', text: 'text-green-700' },
};

const categoryLabels: Record<string, string> = {
  general: '일반',
  technical: '기술',
  showcase: '쇼케이스',
  question: '질문',
  discussion: '토론',
};

export default function PostCard({ post }: PostCardProps) {
  const categoryStyle = categoryColors[post.category] || categoryColors.general;

  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* 카테고리 태그 */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}
          >
            {categoryLabels[post.category]}
          </span>

          {/* 고정 표시 */}
          {post.isPinned && (
            <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a1 1 0 011 1v1.323l3.046 1.826a1 1 0 01.5.867v3.462a1 1 0 01-.5.867L11 13.171V17a1 1 0 11-2 0v-3.829l-3.046-1.826a1 1 0 01-.5-.867V6.016a1 1 0 01.5-.867L9 3.323V3a1 1 0 011-1z" />
              </svg>
              고정됨
            </span>
          )}
        </div>

        {/* 작성 시간 */}
        <time className="text-sm text-gray-500">
          {formatDistanceToNow(post.createdAt, {
            addSuffix: true,
            locale: ko,
          })}
        </time>
      </div>

      {/* 제목 */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {post.title}
      </h3>

      {/* 내용 미리보기 */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {post.content}
      </p>

      {/* 태그 */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 하단 정보 */}
      <div className="flex items-center justify-between">
        {/* 작성자 정보 */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {post.author.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {post.author.username}
          </span>
          {post.author.isVerified && (
            <svg
              className="w-4 h-4 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* 통계 정보 */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {/* 조회수 */}
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {post.viewCount}
          </span>

          {/* 좋아요 */}
          <span className="flex items-center gap-1">
            <svg
              className={`w-4 h-4 ${post.isLiked ? 'text-red-500 fill-current' : ''}`}
              fill={post.isLiked ? 'currentColor' : 'none'}
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
            {post.likeCount}
          </span>

          {/* 댓글 */}
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
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
            {post.commentCount}
          </span>
        </div>
      </div>
    </article>
  );
}