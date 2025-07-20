'use client';

import { Post } from '@/lib/api/posts';
import { useState } from 'react';
import DOMPurify from 'dompurify';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { postsApi } from '@/lib/api/posts';

interface ArticleContentProps {
  post: Post;
}

export default function ArticleContent({ post }: ArticleContentProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (isLiking) return;

    setIsLiking(true);
    try {
      await postsApi.likePost(post.id);
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      toast.success(liked ? '좋아요를 취소했습니다.' : '좋아요를 눌렀습니다.');
    } catch (error) {
      toast.error('오류가 발생했습니다.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.title,
        url: window.location.href,
      }).catch(() => {
        // User cancelled share
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('링크가 복사되었습니다.');
    }
  };

  // 마크다운을 HTML로 변환하고 DOMPurify로 sanitize
  const sanitizedContent = DOMPurify.sanitize(convertMarkdownToHtml(post.content), {
    ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    KEEP_CONTENT: true
  });

  return (
    <article>
      <div className="prose prose-lg max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </div>

      {/* Source link for NEWS articles */}
      {post.category === 'NEWS' && post.sourceUrl && (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="font-medium">원문 출처</span>
              {post.sourceName && (
                <>
                  <span className="text-gray-500">:</span>
                  <span>{post.sourceName}</span>
                </>
              )}
            </div>
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              원문 보기
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between py-6 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              liked 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg 
              className="w-5 h-5" 
              fill={liked ? 'currentColor' : 'none'} 
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
            <span className="font-medium">{likeCount.toLocaleString()}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632-6.632a3 3 0 11-5.368 5.368m0 0a3 3 0 00-5.368 5.368m5.368-5.368L12 10.5" />
            </svg>
            <span className="font-medium">공유</span>
          </button>
        </div>

        <button
          onClick={() => router.push('/articles')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          목록으로 돌아가기
        </button>
      </div>
    </article>
  );
}

// Simple markdown to HTML converter (for demo purposes)
// In production, use a proper markdown parser like marked or remark
function convertMarkdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.+)\*\*/g, '<strong class="font-semibold">$1</strong>');
  
  // Lists
  html = html.replace(/^\* (.+)$/gim, '<li class="ml-4">$1</li>');
  html = html.replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside my-4 space-y-2">$1</ul>');
  
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p class="mb-4">');
  html = '<p class="mb-4">' + html + '</p>';
  
  return html;
}