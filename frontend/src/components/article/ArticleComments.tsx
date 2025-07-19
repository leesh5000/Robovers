'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/lib/api/posts';
import { postsApi } from '@/lib/api/posts';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ArticleCommentsProps {
  postId: string;
}

export default function ArticleComments({ postId }: ArticleCommentsProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const data = await postsApi.getComments(postId);
      setComments(data);
    } catch (error) {
      toast.error('댓글을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (!newComment.trim()) {
      toast.error('댓글 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const comment = await postsApi.addComment(postId, newComment, replyTo || undefined);
      if (replyTo) {
        // Add reply to parent comment
        setComments(comments.map(c => 
          c.id === replyTo 
            ? { ...c, replies: [...(c.replies || []), comment] }
            : c
        ));
      } else {
        // Add new top-level comment
        setComments([comment, ...comments]);
      }
      setNewComment('');
      setReplyTo(null);
      toast.success('댓글이 작성되었습니다.');
    } catch (error) {
      toast.error('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const formattedDate = new Date(comment.createdAt).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div className={`${isReply ? 'ml-12' : ''} ${!isReply ? 'border-b border-gray-100 last:border-0' : ''}`}>
        <div className="py-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              {comment.author.profileImageUrl ? (
                <img 
                  src={comment.author.profileImageUrl} 
                  alt={comment.author.nickname}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {comment.author.nickname.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">{comment.author.nickname}</span>
                <span className="text-sm text-gray-500">{formattedDate}</span>
              </div>
              
              <p className="text-gray-700 mb-2">{comment.content}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{comment.likeCount}</span>
                </button>
                
                {!isReply && (
                  <button 
                    onClick={() => setReplyTo(comment.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    답글
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="border-l-2 border-gray-100 ml-5">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}

        {/* Reply form */}
        {replyTo === comment.id && (
          <div className="ml-12 mb-4">
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="답글을 입력하세요..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                작성
              </button>
              <button
                type="button"
                onClick={() => {
                  setReplyTo(null);
                  setNewComment('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
            </form>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        댓글 {comments.length}개
      </h2>

      {/* Comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={user.nickname}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {user?.nickname.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '작성 중...' : '댓글 작성'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 mb-2">댓글을 작성하려면 로그인이 필요합니다.</p>
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            로그인하기
          </button>
        </div>
      )}

      {/* Comments list */}
      <div>
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </section>
  );
}