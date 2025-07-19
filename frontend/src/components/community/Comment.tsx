'use client';

import { useState } from 'react';
import { Comment as CommentType } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import CommentForm from './CommentForm';

interface CommentProps {
  comment: CommentType;
  onReply?: (parentId: string, content: string) => void;
  onLike?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  depth?: number;
}

export default function Comment({ 
  comment, 
  onReply, 
  onLike, 
  onDelete, 
  depth = 0 
}: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likeCount, setLikeCount] = useState(comment.likeCount);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(comment.id);
  };

  const handleReply = (content: string) => {
    onReply?.(comment.id, content);
    setIsReplying(false);
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      onDelete?.(comment.id);
    }
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 pl-4 border-l-2 border-gray-100' : ''}`}>
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        {/* 댓글 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* 작성자 아바타 */}
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              {comment.author.avatar ? (
                <img
                  src={comment.author.avatar}
                  alt={comment.author.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {comment.author.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* 작성자 정보 */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 text-sm">
                  {comment.author.username}
                </span>
                {comment.author.isVerified && (
                  <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <time className="text-xs text-gray-500">
                {formatDistanceToNow(comment.createdAt, {
                  addSuffix: true,
                  locale: ko,
                })}
              </time>
            </div>
          </div>

          {/* 더보기 메뉴 */}
          <div className="relative">
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 댓글 내용 */}
        <div className="mb-3">
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>

        {/* 댓글 액션 */}
        <div className="flex items-center gap-4">
          {/* 좋아요 버튼 */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs font-medium transition-colors ${
              isLiked
                ? 'text-red-600 hover:text-red-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg
              className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}
              fill={isLiked ? 'currentColor' : 'none'}
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
            {likeCount > 0 ? likeCount : '좋아요'}
          </button>

          {/* 답글 버튼 */}
          {depth < 2 && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
              답글
            </button>
          )}

          {/* 대댓글 토글 (대댓글이 있는 경우) */}
          {comment.replies && comment.replies.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {isExpanded ? '답글 숨기기' : `답글 ${comment.replies.length}개 보기`}
            </button>
          )}

          {/* 삭제 버튼 (임시 - 실제로는 권한 체크 필요) */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 transition-colors ml-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            삭제
          </button>
        </div>

        {/* 답글 작성 폼 */}
        {isReplying && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <CommentForm
              onSubmit={handleReply}
              onCancel={() => setIsReplying(false)}
              placeholder="답글을 작성하세요..."
              buttonText="답글 작성"
            />
          </div>
        )}
      </div>

      {/* 대댓글 목록 */}
      {isExpanded && comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}