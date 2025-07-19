'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Post } from '@/lib/api/posts';
import { postsApi } from '@/lib/api/posts';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArticleContent from '@/components/article/ArticleContent';
import ArticleComments from '@/components/article/ArticleComments';
import toast from 'react-hot-toast';

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (articleId) {
      fetchPost();
    }
  }, [articleId]);

  const fetchPost = async () => {
    try {
      const data = await postsApi.getPost(articleId);
      setPost(data);
    } catch (error) {
      toast.error('기사를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">기사를 찾을 수 없습니다</h2>
          <p className="text-gray-600">요청하신 기사가 존재하지 않거나 삭제되었습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <ArticleHeader post={post} />
          <ArticleContent post={post} />
          <ArticleComments postId={post.id} />
        </div>
      </div>
    </div>
  );
}