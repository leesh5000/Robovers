import { Post, PostCategory } from '@/lib/api/posts';
import Link from 'next/link';

interface ArticleHeaderProps {
  post: Post;
}

const categoryColors: Record<PostCategory, string> = {
  NEWS: 'bg-blue-100 text-blue-800',
  DISCUSSION: 'bg-purple-100 text-purple-800',
  QUESTION: 'bg-yellow-100 text-yellow-800',
  TUTORIAL: 'bg-green-100 text-green-800',
  REVIEW: 'bg-orange-100 text-orange-800',
  ANALYSIS: 'bg-indigo-100 text-indigo-800',
};

const categoryLabels: Record<PostCategory, string> = {
  NEWS: '뉴스',
  DISCUSSION: '토론',
  QUESTION: '질문',
  TUTORIAL: '튜토리얼',
  REVIEW: '리뷰',
  ANALYSIS: '분석',
};

export default function ArticleHeader({ post }: ArticleHeaderProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="border-b border-gray-200 pb-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryColors[post.category]}`}>
          {categoryLabels[post.category]}
        </span>
        {post.robot && (
          <Link 
            href={`/robots/${post.robot.id}`}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            🤖 {post.robot.name}
          </Link>
        )}
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
        {post.title}
      </h1>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              {post.author.profileImageUrl ? (
                <img 
                  src={post.author.profileImageUrl} 
                  alt={post.author.nickname}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-gray-600">
                  {post.author.nickname.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="font-medium">{post.author.nickname}</span>
          </div>
          <span>•</span>
          <time dateTime={post.createdAt}>{formattedDate}</time>
        </div>

        <div className="flex items-center gap-4 text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{post.viewCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{post.likeCount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/articles?tag=${encodeURIComponent(tag)}`}
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}