import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from '../useErrorHandler';
import { AppException, ErrorCode } from '@/lib/errors';

describe('useErrorHandler', () => {
  let mockConsoleWarn: jest.SpyInstance;
  let mockConsoleError: jest.SpyInstance;

  beforeEach(() => {
    mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    mockConsoleWarn.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('handleError function', () => {
    it('should handle AppException and return AppError', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = new AppException(ErrorCode.VALIDATION_ERROR, 'Invalid input data');

      let returnedError;
      act(() => {
        returnedError = result.current.handleError(error);
      });

      expect(returnedError).toEqual({
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Invalid input data',
        statusCode: undefined,
        details: undefined
      });
    });

    it('should log error to console by default', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = new AppException(ErrorCode.VALIDATION_ERROR, 'Test error');

      act(() => {
        result.current.handleError(error);
      });

      expect(mockConsoleError).toHaveBeenCalledWith('[Error]', expect.objectContaining({
        context: 'Unknown',
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Test error',
        timestamp: expect.any(String)
      }));
    });

    it('should not log when logToConsole is false', () => {
      const { result } = renderHook(() => useErrorHandler({ logToConsole: false }));
      const error = new AppException(ErrorCode.VALIDATION_ERROR, 'Test error');

      act(() => {
        result.current.handleError(error);
      });

      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should show toast warning when showToast is true', () => {
      const { result } = renderHook(() => useErrorHandler({ showToast: true }));
      const error = new AppException(ErrorCode.VALIDATION_ERROR, 'Test error');

      act(() => {
        result.current.handleError(error);
      });

      expect(mockConsoleWarn).toHaveBeenCalledWith('Toast display requested but not implemented');
    });

    it('should not show toast warning when showToast is false', () => {
      const { result } = renderHook(() => useErrorHandler({ showToast: false }));
      const error = new AppException(ErrorCode.VALIDATION_ERROR, 'Test error');

      act(() => {
        result.current.handleError(error);
      });

      expect(mockConsoleWarn).not.toHaveBeenCalled();
    });

    it('should call custom onError callback', () => {
      const mockOnError = jest.fn();
      const { result } = renderHook(() => useErrorHandler({ onError: mockOnError }));
      const error = new AppException(ErrorCode.VALIDATION_ERROR, 'Test error');

      act(() => {
        result.current.handleError(error);
      });

      expect(mockOnError).toHaveBeenCalledWith({
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Test error',
        statusCode: undefined,
        details: undefined
      });
    });

    it('should handle generic Error objects', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = new Error('Generic error message');

      let returnedError;
      act(() => {
        returnedError = result.current.handleError(error);
      });

      expect(returnedError).toEqual({
        code: ErrorCode.UNKNOWN_ERROR,
        message: 'Generic error message'
      });
    });

    it('should handle string errors', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = 'String error message';

      let returnedError;
      act(() => {
        returnedError = result.current.handleError(error);
      });

      expect(returnedError).toEqual({
        code: ErrorCode.UNKNOWN_ERROR,
        message: '알 수 없는 오류가 발생했습니다.'
      });
    });

    it('should handle unknown error types', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = { some: 'object' };

      let returnedError;
      act(() => {
        returnedError = result.current.handleError(error);
      });

      expect(returnedError).toEqual({
        code: ErrorCode.UNKNOWN_ERROR,
        message: '알 수 없는 오류가 발생했습니다.'
      });
    });

    it('should use custom context in logging', () => {
      const { result } = renderHook(() => useErrorHandler({ context: 'Custom Context' }));
      const error = new AppException(ErrorCode.VALIDATION_ERROR, 'Test error');

      act(() => {
        result.current.handleError(error);
      });

      expect(mockConsoleError).toHaveBeenCalledWith('[Error]', expect.objectContaining({
        context: 'Custom Context',
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Test error',
        timestamp: expect.any(String)
      }));
    });
  });

  describe('getErrorMessage function', () => {
    it('should return user-friendly message for AppException', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = new AppException(ErrorCode.VALIDATION_ERROR, 'Custom validation message');

      const message = result.current.getErrorMessage(error);

      expect(message).toBe('입력 데이터가 올바르지 않습니다.'); // Uses ERROR_MESSAGES mapping
    });

    it('should return default message for error codes', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = new AppException(ErrorCode.NETWORK_ERROR);

      const message = result.current.getErrorMessage(error);

      expect(message).toBe('네트워크 연결을 확인해주세요.');
    });

    it('should handle generic Error objects', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = new Error('Generic error');

      const message = result.current.getErrorMessage(error);

      expect(message).toBe('알 수 없는 오류가 발생했습니다.'); // Uses ERROR_MESSAGES for UNKNOWN_ERROR
    });

    it('should handle unknown error types', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = { some: 'object' };

      const message = result.current.getErrorMessage(error);

      expect(message).toBe('알 수 없는 오류가 발생했습니다.');
    });
  });

  describe('error code handling', () => {
    it('should handle all AppError codes correctly', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const errorCases = [
        { code: ErrorCode.VALIDATION_ERROR, expectedMessage: 'Validation failed' },
        { code: ErrorCode.RESOURCE_ALREADY_EXISTS, expectedMessage: 'Duplicate entry' },
        { code: ErrorCode.API_ERROR, expectedMessage: 'Too many requests' },
        { code: ErrorCode.UNAUTHORIZED, expectedMessage: 'Unauthorized access' },
        { code: ErrorCode.FORBIDDEN, expectedMessage: 'Access forbidden' },
        { code: ErrorCode.RESOURCE_NOT_FOUND, expectedMessage: 'Resource not found' },
        { code: ErrorCode.SERVER_ERROR, expectedMessage: 'Internal server error' },
        { code: ErrorCode.NETWORK_ERROR, expectedMessage: 'Network error' },
      ];

      errorCases.forEach(({ code, expectedMessage }) => {
        const error = new AppException(code, expectedMessage);
        
        let returnedError;
        act(() => {
          returnedError = result.current.handleError(error);
        });

        expect(returnedError).toEqual({
          code,
          message: expectedMessage,
          statusCode: undefined,
          details: undefined
        });
      });
    });
  });

  describe('edge cases', () => {
    it('should handle null error', () => {
      const { result } = renderHook(() => useErrorHandler());

      let returnedError;
      act(() => {
        returnedError = result.current.handleError(null as any);
      });

      expect(returnedError).toEqual({
        code: ErrorCode.UNKNOWN_ERROR,
        message: '알 수 없는 오류가 발생했습니다.'
      });
    });

    it('should handle undefined error', () => {
      const { result } = renderHook(() => useErrorHandler());

      let returnedError;
      act(() => {
        returnedError = result.current.handleError(undefined as any);
      });

      expect(returnedError).toEqual({
        code: ErrorCode.UNKNOWN_ERROR,
        message: '알 수 없는 오류가 발생했습니다.'
      });
    });

    it('should handle empty error message', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = new Error('');

      let returnedError;
      act(() => {
        returnedError = result.current.handleError(error);
      });

      expect(returnedError).toEqual({
        code: ErrorCode.UNKNOWN_ERROR,
        message: '알 수 없는 오류가 발생했습니다.'
      });
    });

    it('should handle axios-like errors', () => {
      const { result } = renderHook(() => useErrorHandler());
      // Create a proper Error object with axios-like properties
      const axiosError = new Error('Request failed with status code 404');
      Object.assign(axiosError, {
        response: {
          status: 404,
          data: { message: 'Not found' }
        }
      });

      let returnedError;
      act(() => {
        returnedError = result.current.handleError(axiosError);
      });

      expect(returnedError).toEqual({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: 'Not found',
        statusCode: 404,
        details: { message: 'Not found' }
      });
    });

    it('should handle network errors', () => {
      const { result } = renderHook(() => useErrorHandler());
      // Create a proper Error object with network error properties
      const networkError = new Error('Network Error');
      Object.assign(networkError, {
        request: {},
        code: 'NETWORK_ERROR'
      });

      let returnedError;
      act(() => {
        returnedError = result.current.handleError(networkError);
      });

      expect(returnedError).toEqual({
        code: ErrorCode.NETWORK_ERROR,
        message: '네트워크 연결을 확인해주세요.'
      });
    });
  });
});