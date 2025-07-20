'use client';

import { useCallback } from 'react';
import { createAppError, logError, getUserFriendlyMessage, AppError } from '@/lib/errors';

export interface UseErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  context?: string;
  onError?: (error: AppError) => void;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const {
    showToast = false,
    logToConsole = true,
    context = 'Unknown',
    onError
  } = options;

  const handleError = useCallback((error: unknown) => {
    const appError = createAppError(error);
    
    // 에러 로깅
    if (logToConsole) {
      logError(appError, context);
    }
    
    // 토스트 표시 (토스트 라이브러리가 있다면)
    if (showToast) {
      // TODO: 토스트 라이브러리 연동
      console.warn('Toast display requested but not implemented');
    }
    
    // 커스텀 에러 핸들러 실행
    if (onError) {
      onError(appError);
    }
    
    return appError;
  }, [showToast, logToConsole, context, onError]);

  const getErrorMessage = useCallback((error: unknown): string => {
    const appError = createAppError(error);
    return getUserFriendlyMessage(appError);
  }, []);

  return {
    handleError,
    getErrorMessage
  };
}