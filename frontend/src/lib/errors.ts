// 표준 에러 타입 정의
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

// 에러 타입 enum
export enum ErrorCode {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Business logic errors
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  
  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SERVER_ERROR = 'SERVER_ERROR'
}

// 에러 메시지 매핑 (한국어)
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.NETWORK_ERROR]: '네트워크 연결을 확인해주세요.',
  [ErrorCode.API_ERROR]: 'API 요청 중 오류가 발생했습니다.',
  [ErrorCode.TIMEOUT_ERROR]: '요청 시간이 초과되었습니다.',
  
  [ErrorCode.UNAUTHORIZED]: '로그인이 필요합니다.',
  [ErrorCode.FORBIDDEN]: '접근 권한이 없습니다.',
  [ErrorCode.TOKEN_EXPIRED]: '로그인이 만료되었습니다. 다시 로그인해주세요.',
  [ErrorCode.EMAIL_NOT_VERIFIED]: '이메일 인증이 필요합니다.',
  
  [ErrorCode.VALIDATION_ERROR]: '입력 데이터가 올바르지 않습니다.',
  [ErrorCode.REQUIRED_FIELD]: '필수 입력 항목입니다.',
  [ErrorCode.INVALID_FORMAT]: '입력 형식이 올바르지 않습니다.',
  
  [ErrorCode.RESOURCE_NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다.',
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: '이미 존재하는 리소스입니다.',
  [ErrorCode.PERMISSION_DENIED]: '권한이 없습니다.',
  
  [ErrorCode.UNKNOWN_ERROR]: '알 수 없는 오류가 발생했습니다.',
  [ErrorCode.SERVER_ERROR]: '서버 오류가 발생했습니다.'
};

// 커스텀 에러 클래스
export class AppException extends Error {
  code: ErrorCode;
  statusCode?: number;
  details?: Record<string, unknown>;

  constructor(code: ErrorCode, message?: string, statusCode?: number, details?: Record<string, unknown>) {
    super(message || ERROR_MESSAGES[code]);
    this.name = 'AppException';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// HTTP 상태 코드에서 에러 코드 매핑
export function mapHttpStatusToErrorCode(status: number): ErrorCode {
  switch (status) {
    case 400:
      return ErrorCode.VALIDATION_ERROR;
    case 401:
      return ErrorCode.UNAUTHORIZED;
    case 403:
      return ErrorCode.FORBIDDEN;
    case 404:
      return ErrorCode.RESOURCE_NOT_FOUND;
    case 409:
      return ErrorCode.RESOURCE_ALREADY_EXISTS;
    case 422:
      return ErrorCode.VALIDATION_ERROR;
    case 500:
      return ErrorCode.SERVER_ERROR;
    default:
      if (status >= 400 && status < 500) {
        return ErrorCode.API_ERROR;
      }
      return ErrorCode.SERVER_ERROR;
  }
}

// 에러 처리 유틸리티 함수
export function createAppError(error: unknown): AppError {
  if (error instanceof AppException) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details
    };
  }

  if (error instanceof Error) {
    // Axios 에러 처리
    if ('response' in error && typeof error.response === 'object' && error.response) {
      const response = error.response as { status: number; data?: { message?: string } };
      const code = mapHttpStatusToErrorCode(response.status);
      return {
        code,
        message: response.data?.message || ERROR_MESSAGES[code],
        statusCode: response.status,
        details: response.data
      };
    }

    // 네트워크 에러 처리 (Axios network error)
    if ('request' in error && !('response' in error)) {
      return {
        code: ErrorCode.NETWORK_ERROR,
        message: ERROR_MESSAGES[ErrorCode.NETWORK_ERROR]
      };
    }

    // 네트워크 에러 처리
    if ('code' in error && error.code === 'NETWORK_ERROR') {
      return {
        code: ErrorCode.NETWORK_ERROR,
        message: ERROR_MESSAGES[ErrorCode.NETWORK_ERROR]
      };
    }

    // 일반 Error 객체
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error.message || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR]
    };
  }

  // 알 수 없는 에러
  return {
    code: ErrorCode.UNKNOWN_ERROR,
    message: ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR]
  };
}

// 에러 로깅 함수
export function logError(error: AppError | Error, context?: string) {
  const errorInfo = error instanceof Error ? createAppError(error) : error;
  
  console.error('[Error]', {
    context,
    code: errorInfo.code,
    message: errorInfo.message,
    statusCode: errorInfo.statusCode,
    details: errorInfo.details,
    timestamp: new Date().toISOString()
  });
}

// 사용자 친화적 에러 메시지 생성
export function getUserFriendlyMessage(error: AppError | Error): string {
  const appError = error instanceof Error ? createAppError(error) : error;
  return ERROR_MESSAGES[appError.code as ErrorCode] || appError.message;
}