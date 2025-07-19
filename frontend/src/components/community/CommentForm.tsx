'use client';

import { useState } from 'react';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  buttonText?: string;
  showCancel?: boolean;
}

export default function CommentForm({
  onSubmit,
  onCancel,
  placeholder = '댓글을 작성하세요...',
  buttonText = '댓글 작성',
  showCancel = true,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
          disabled={isSubmitting}
        />
        
        {/* 글자 수 카운터 */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {content.length}/500자
          </span>
          {content.length > 500 && (
            <span className="text-xs text-red-500">
              글자 수를 초과했습니다.
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {showCancel && onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting || !content.trim() || content.length > 500}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting && (
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {isSubmitting ? '작성 중...' : buttonText}
        </button>
      </div>

      {/* 댓글 작성 가이드라인 */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">댓글 작성 시 주의사항:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>상호 존중하는 언어를 사용해주세요</li>
          <li>개인정보나 연락처는 공개하지 마세요</li>
          <li>광고나 홍보성 내용은 삼가해주세요</li>
        </ul>
      </div>
    </form>
  );
}