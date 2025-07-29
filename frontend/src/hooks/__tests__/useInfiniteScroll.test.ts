import { renderHook, act } from '@testing-library/react';
import { useInfiniteScroll } from '../useInfiniteScroll';

// Mock IntersectionObserver
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
const mockUnobserve = jest.fn();

let mockCallback: (entries: IntersectionObserverEntry[]) => void;

const mockIntersectionObserver = jest.fn().mockImplementation((callback) => {
  mockCallback = callback;
  return {
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: mockUnobserve,
  };
});

// Mock window.IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
});

describe('useInfiniteScroll', () => {
  const mockOnLoadMore = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnLoadMore.mockClear();
    mockObserve.mockClear();
    mockDisconnect.mockClear();
    mockUnobserve.mockClear();
    mockIntersectionObserver.mockClear();
  });

  describe('기본 동작', () => {
    it('should return a ref object', () => {
      const { result } = renderHook(() =>
        useInfiniteScroll({
          onLoadMore: mockOnLoadMore,
          hasMore: true,
          isLoading: false,
        })
      );

      expect(result.current).toEqual({ current: null });
    });

    it('should not create IntersectionObserver when ref is null', () => {
      renderHook(() =>
        useInfiniteScroll({
          onLoadMore: mockOnLoadMore,
          hasMore: true,
          isLoading: false,
        })
      );

      expect(mockIntersectionObserver).not.toHaveBeenCalled();
    });
  });

  describe('ref 설정 시 IntersectionObserver 생성', () => {
    it('should create IntersectionObserver with default options when ref is set', () => {
      const { result, rerender } = renderHook(
        (props) => useInfiniteScroll(props),
        {
          initialProps: {
            onLoadMore: mockOnLoadMore,
            hasMore: true,
            isLoading: false,
          },
        }
      );

      // Mock DOM element
      const mockElement = document.createElement('div');

      act(() => {
        // Simulate ref assignment
        result.current.current = mockElement;
        // Force re-render to trigger useEffect
        rerender({
          onLoadMore: mockOnLoadMore,
          hasMore: true,  
          isLoading: false,
        });
      });

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          threshold: 0.1,
          rootMargin: '200px',
        }
      );
      expect(mockObserve).toHaveBeenCalledWith(mockElement);
    });

    it('should create IntersectionObserver with custom options', () => {
      const { result, rerender } = renderHook(
        (props) => useInfiniteScroll(props),
        {
          initialProps: {
            onLoadMore: mockOnLoadMore,
            hasMore: true,
            isLoading: false,
            threshold: 0.5,
            rootMargin: '100px',
          },
        }
      );

      const mockElement = document.createElement('div');

      act(() => {
        result.current.current = mockElement;
        rerender({
          onLoadMore: mockOnLoadMore,
          hasMore: true,
          isLoading: false,
          threshold: 0.5,
          rootMargin: '100px',
        });
      });

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          threshold: 0.5,
          rootMargin: '100px',
        }
      );
    });
  });

  describe('IntersectionObserver 콜백 동작', () => {
    beforeEach(() => {
      // Setup hook with DOM element
      const { result, rerender } = renderHook(
        (props) => useInfiniteScroll(props),
        {
          initialProps: {
            onLoadMore: mockOnLoadMore,
            hasMore: true,
            isLoading: false,
          },
        }
      );

      const mockElement = document.createElement('div');
      act(() => {
        result.current.current = mockElement;
        rerender({
          onLoadMore: mockOnLoadMore,
          hasMore: true,
          isLoading: false,
        });
      });
    });

    it('should call onLoadMore when target is intersecting and conditions are met', () => {
      const mockEntry: Partial<IntersectionObserverEntry> = {
        isIntersecting: true,
      };

      act(() => {
        mockCallback([mockEntry as IntersectionObserverEntry]);
      });

      expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
    });

    it('should not call onLoadMore when target is not intersecting', () => {
      const mockEntry: Partial<IntersectionObserverEntry> = {
        isIntersecting: false,
      };

      act(() => {
        mockCallback([mockEntry as IntersectionObserverEntry]);
      });

      expect(mockOnLoadMore).not.toHaveBeenCalled();
    });
  });

  describe('조건부 로딩', () => {
    it('should not call onLoadMore when hasMore is false', () => {
      const { result, rerender } = renderHook(
        (props) => useInfiniteScroll(props),
        {
          initialProps: {
            onLoadMore: mockOnLoadMore,
            hasMore: false,
            isLoading: false,
          },
        }
      );

      const mockElement = document.createElement('div');
      act(() => {
        result.current.current = mockElement;
        rerender({
          onLoadMore: mockOnLoadMore,
          hasMore: false,
          isLoading: false,
        });
      });

      const mockEntry: Partial<IntersectionObserverEntry> = {
        isIntersecting: true,
      };

      act(() => {
        mockCallback([mockEntry as IntersectionObserverEntry]);
      });

      expect(mockOnLoadMore).not.toHaveBeenCalled();
    });

    it('should not call onLoadMore when isLoading is true', () => {
      const { result, rerender } = renderHook(
        (props) => useInfiniteScroll(props),
        {
          initialProps: {
            onLoadMore: mockOnLoadMore,
            hasMore: true,
            isLoading: true,
          },
        }
      );

      const mockElement = document.createElement('div');
      act(() => {
        result.current.current = mockElement;
        rerender({
          onLoadMore: mockOnLoadMore,
          hasMore: true,
          isLoading: true,
        });
      });

      const mockEntry: Partial<IntersectionObserverEntry> = {
        isIntersecting: true,
      };

      act(() => {
        mockCallback([mockEntry as IntersectionObserverEntry]);
      });

      expect(mockOnLoadMore).not.toHaveBeenCalled();
    });
  });

  describe('Observer 생명주기 관리', () => {
    it('should disconnect observer when unmounted', () => {
      const { result, rerender, unmount } = renderHook(
        (props) => useInfiniteScroll(props),
        {
          initialProps: {
            onLoadMore: mockOnLoadMore,
            hasMore: true,
            isLoading: false,
          },
        }
      );

      const mockElement = document.createElement('div');
      act(() => {
        result.current.current = mockElement;
        rerender({
          onLoadMore: mockOnLoadMore,
          hasMore: true,
          isLoading: false,
        });
      });

      // Observer should be created
      expect(mockIntersectionObserver).toHaveBeenCalled();

      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should disconnect and recreate observer when dependencies change', () => {
      const { result, rerender } = renderHook(
        (props) => useInfiniteScroll(props),
        {
          initialProps: {
            onLoadMore: mockOnLoadMore,
            hasMore: true,
            isLoading: false,
            threshold: 0.1,
          },
        }
      );

      const mockElement = document.createElement('div');
      act(() => {
        result.current.current = mockElement;
        rerender({
          onLoadMore: mockOnLoadMore,
          hasMore: true,
          isLoading: false,
          threshold: 0.1,
        });
      });

      // First observer creation
      expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);

      // Change threshold
      act(() => {
        rerender({
          onLoadMore: mockOnLoadMore,
          hasMore: true,
          isLoading: false,
          threshold: 0.5,
        });
      });

      // Should disconnect old observer and create new one
      expect(mockDisconnect).toHaveBeenCalled();
      expect(mockIntersectionObserver).toHaveBeenCalledTimes(2);
    });
  });

  describe('콜백 메모이제이션', () => {
    it('should handle callback dependencies correctly', () => {
      const newOnLoadMore = jest.fn();

      const { result, rerender } = renderHook(
        (props) => useInfiniteScroll(props),
        {
          initialProps: {
            onLoadMore: mockOnLoadMore,
            hasMore: true,
            isLoading: false,
          },
        }
      );

      const mockElement = document.createElement('div');
      act(() => {
        result.current.current = mockElement;
        rerender({
          onLoadMore: mockOnLoadMore,
          hasMore: true,
          isLoading: false,
        });
      });

      const initialCallCount = mockIntersectionObserver.mock.calls.length;

      // Change onLoadMore function
      act(() => {
        rerender({
          onLoadMore: newOnLoadMore,
          hasMore: true,
          isLoading: false,
        });
      });

      // Should recreate observer due to callback change
      expect(mockIntersectionObserver.mock.calls.length).toBeGreaterThan(initialCallCount);
    });
  });

  describe('에지 케이스', () => {
    it('should handle multiple intersection entries correctly', () => {
      const { result, rerender } = renderHook(
        (props) => useInfiniteScroll(props),
        {
          initialProps: {
            onLoadMore: mockOnLoadMore,
            hasMore: true,
            isLoading: false,
          },
        }
      );

      const mockElement = document.createElement('div');
      act(() => {
        result.current.current = mockElement;
        rerender({
          onLoadMore: mockOnLoadMore,
          hasMore: true,
          isLoading: false,
        });
      });

      const mockEntries: Partial<IntersectionObserverEntry>[] = [
        { isIntersecting: true },
        { isIntersecting: false },
        { isIntersecting: true },
      ];

      act(() => {
        mockCallback(mockEntries as IntersectionObserverEntry[]);
      });

      // Should only consider the first entry
      expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
    });

    it('should handle empty entries array', () => {
      const { result, rerender } = renderHook(
        (props) => useInfiniteScroll(props),
        {
          initialProps: {
            onLoadMore: mockOnLoadMore,
            hasMore: true,
            isLoading: false,
          },
        }
      );

      const mockElement = document.createElement('div');
      act(() => {
        result.current.current = mockElement;
        rerender({
          onLoadMore: mockOnLoadMore,
          hasMore: true,
          isLoading: false,
        });
      });

      act(() => {
        mockCallback([]);
      });

      expect(mockOnLoadMore).not.toHaveBeenCalled();
    });
  });
});