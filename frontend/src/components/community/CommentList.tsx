'use client';

import { useState, useEffect } from 'react';
import { Comment as CommentType } from '@/lib/types';
import { getDummyComments } from '@/lib/dummy-data';
import Comment from './Comment';
import CommentForm from './CommentForm';
import Dropdown from '@/components/ui/Dropdown';

interface CommentListProps {
  postId: string;
  highlightCommentId?: string | null;
}

export default function CommentList({ postId, highlightCommentId }: CommentListProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'popular'>('latest');

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'popular', label: '좋아요순' },
  ];

  useEffect(() => {
    loadComments();
  }, [postId, sortBy]);

  // 하이라이팅된 댓글로 스크롤
  useEffect(() => {
    if (highlightCommentId && !isLoading) {
      setTimeout(() => {
        const element = document.getElementById(`comment-${highlightCommentId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [highlightCommentId, isLoading]);

  const loadComments = async () => {
    setIsLoading(true);
    
    // API 호출 시뮬레이션
    setTimeout(() => {
      let commentsData = getDummyComments(postId);
      
      // 정렬 적용
      switch (sortBy) {
        case 'latest':
          commentsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case 'oldest':
          commentsData.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
          break;
        case 'popular':
          commentsData.sort((a, b) => b.likeCount - a.likeCount);
          break;
      }
      
      setComments(commentsData);
      setIsLoading(false);
    }, 300);
  };

  const handleAddComment = async (content: string) => {
    // 새 댓글 추가 시뮬레이션
    const newComment: CommentType = {
      id: `comment-${Date.now()}`,
      content,
      author: {
        id: 'current-user',
        username: '현재사용자',
        email: 'current@example.com',
        avatar: '',
        isVerified: false,
        joinedAt: new Date(),
      },
      createdAt: new Date(),
      likeCount: 0,
      isLiked: false,
    };

    setComments(prev => [newComment, ...prev]);
  };

  const handleReply = async (parentId: string, content: string) => {
    // 답글 추가 시뮬레이션
    const newReply: CommentType = {
      id: `reply-${Date.now()}`,
      content,
      author: {
        id: 'current-user',
        username: '현재사용자',
        email: 'current@example.com',
        avatar: '',
        isVerified: false,
        joinedAt: new Date(),
      },
      createdAt: new Date(),
      likeCount: 0,
      isLiked: false,
      parentId,
    };

    setComments(prev => {
      return prev.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies ? [...comment.replies, newReply] : [newReply],
          };
        }
        return comment;
      });
    });
  };

  const handleLike = (commentId: string) => {
    setComments(prev => {
      return prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likeCount: comment.isLiked ? comment.likeCount - 1 : comment.likeCount + 1,
          };
        }
        // 대댓글에서도 찾기
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likeCount: reply.isLiked ? reply.likeCount - 1 : reply.likeCount + 1,
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      });
    });
  };

  const handleDelete = (commentId: string) => {
    setComments(prev => {
      return prev.filter(comment => {
        if (comment.id === commentId) {
          return false;
        }
        // 대댓글에서도 제거
        if (comment.replies) {
          comment.replies = comment.replies.filter(reply => reply.id !== commentId);
        }
        return true;
      });
    });
  };

  const topLevelComments = comments.filter(comment => !comment.parentId);

  return (
    <div className="space-y-6">
      {/* 댓글 섹션 헤더 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            댓글 {comments.filter(c => !c.parentId).length}개
          </h3>
          
          {/* 정렬 옵션 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">정렬:</span>
            <Dropdown
              options={sortOptions}
              value={sortBy}
              onChange={(value) => setSortBy(value as 'latest' | 'oldest' | 'popular')}
              className="w-32"
              size="sm"
            />
          </div>
        </div>

        {/* 댓글 작성 폼 */}
        <CommentForm
          onSubmit={handleAddComment}
          placeholder="댓글을 작성하세요..."
          buttonText="댓글 작성"
          showCancel={false}
        />
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {isLoading ? (
          // 로딩 스켈레톤
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                  <div className="h-3 bg-gray-200 rounded w-8"></div>
                </div>
              </div>
            ))}
          </div>
        ) : topLevelComments.length > 0 ? (
          topLevelComments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onLike={handleLike}
              onDelete={handleDelete}
              isHighlighted={comment.id === highlightCommentId}
              highlightCommentId={highlightCommentId}
            />
          ))
        ) : (
          // 댓글이 없는 경우
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              아직 댓글이 없습니다
            </h3>
            <p className="text-gray-500">
              첫 번째 댓글을 작성해보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}