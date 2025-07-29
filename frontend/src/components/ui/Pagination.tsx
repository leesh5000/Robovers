'use client';

import clsx from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}: PaginationProps) {
  // 표시할 페이지 번호 계산
  const getPageNumbers = () => {
    const delta = 2; // 현재 페이지 좌우로 표시할 페이지 수
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={clsx('flex items-center justify-center', className)}>
      <div className="flex items-center space-x-1">
        {/* 이전 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={clsx(
            'relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md',
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 border border-gray-300'
          )}
          aria-label="이전 페이지"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 페이지 번호 */}
        <div className="hidden sm:flex sm:items-center sm:space-x-1">
          {getPageNumbers().map((number, index) => (
            <div key={index}>
              {number === '...' ? (
                <span className="px-4 py-2 text-sm text-gray-700">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(number as number)}
                  className={clsx(
                    'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    currentPage === number
                      ? 'z-10 bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  )}
                  aria-current={currentPage === number ? 'page' : undefined}
                >
                  {number}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 모바일용 간소화된 표시 */}
        <div className="flex items-center sm:hidden">
          <span className="px-4 py-2 text-sm text-gray-700">
            {currentPage} / {totalPages}
          </span>
        </div>

        {/* 다음 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={clsx(
            'relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md',
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 border border-gray-300'
          )}
          aria-label="다음 페이지"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </nav>
  );
}