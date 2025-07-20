import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 0.1,
  rootMargin = '200px',
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    // 이전 observer가 있다면 정리
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // 새로운 observer 생성
    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold,
      rootMargin,
    });

    // 요소 관찰 시작
    observerRef.current.observe(element);

    // cleanup function - 컴포넌트 언마운트 시 또는 dependencies 변경 시 실행
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [handleObserver, threshold, rootMargin]);

  return loadMoreRef;
}