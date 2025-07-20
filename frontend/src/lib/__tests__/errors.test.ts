import {
  AppException,
  ErrorCode,
  ERROR_MESSAGES,
  mapHttpStatusToErrorCode,
  createAppError,
  getUserFriendlyMessage,
} from '../errors';

describe('AppException', () => {
  it('should create exception with error code', () => {
    const exception = new AppException(ErrorCode.VALIDATION_ERROR);
    expect(exception.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(exception.message).toBe(ERROR_MESSAGES[ErrorCode.VALIDATION_ERROR]);
    expect(exception.name).toBe('AppException');
  });

  it('should create exception with custom message', () => {
    const customMessage = '커스텀 에러 메시지';
    const exception = new AppException(ErrorCode.VALIDATION_ERROR, customMessage);
    expect(exception.message).toBe(customMessage);
  });

  it('should create exception with status code and details', () => {
    const statusCode = 400;
    const details = { field: 'email', value: 'invalid' };
    const exception = new AppException(
      ErrorCode.VALIDATION_ERROR,
      undefined,
      statusCode,
      details
    );
    expect(exception.statusCode).toBe(statusCode);
    expect(exception.details).toBe(details);
  });
});

describe('mapHttpStatusToErrorCode', () => {
  it('should map 400 to VALIDATION_ERROR', () => {
    expect(mapHttpStatusToErrorCode(400)).toBe(ErrorCode.VALIDATION_ERROR);
  });

  it('should map 401 to UNAUTHORIZED', () => {
    expect(mapHttpStatusToErrorCode(401)).toBe(ErrorCode.UNAUTHORIZED);
  });

  it('should map 403 to FORBIDDEN', () => {
    expect(mapHttpStatusToErrorCode(403)).toBe(ErrorCode.FORBIDDEN);
  });

  it('should map 404 to RESOURCE_NOT_FOUND', () => {
    expect(mapHttpStatusToErrorCode(404)).toBe(ErrorCode.RESOURCE_NOT_FOUND);
  });

  it('should map 409 to RESOURCE_ALREADY_EXISTS', () => {
    expect(mapHttpStatusToErrorCode(409)).toBe(ErrorCode.RESOURCE_ALREADY_EXISTS);
  });

  it('should map 422 to VALIDATION_ERROR', () => {
    expect(mapHttpStatusToErrorCode(422)).toBe(ErrorCode.VALIDATION_ERROR);
  });

  it('should map 500 to SERVER_ERROR', () => {
    expect(mapHttpStatusToErrorCode(500)).toBe(ErrorCode.SERVER_ERROR);
  });

  it('should map other 4xx codes to API_ERROR', () => {
    expect(mapHttpStatusToErrorCode(418)).toBe(ErrorCode.API_ERROR);
    expect(mapHttpStatusToErrorCode(429)).toBe(ErrorCode.API_ERROR);
  });

  it('should map other 5xx codes to SERVER_ERROR', () => {
    expect(mapHttpStatusToErrorCode(502)).toBe(ErrorCode.SERVER_ERROR);
    expect(mapHttpStatusToErrorCode(503)).toBe(ErrorCode.SERVER_ERROR);
  });
});

describe('createAppError', () => {
  it('should handle AppException', () => {
    const originalException = new AppException(
      ErrorCode.VALIDATION_ERROR,
      'Custom message',
      400,
      { field: 'test' }
    );
    
    const appError = createAppError(originalException);
    
    expect(appError.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(appError.message).toBe('Custom message');
    expect(appError.statusCode).toBe(400);
    expect(appError.details).toEqual({ field: 'test' });
  });

  it('should handle axios-like error responses', () => {
    const axiosError = {
      response: {
        status: 404,
        data: {
          message: 'Resource not found',
          details: { id: '123' }
        }
      }
    };
    
    const appError = createAppError(axiosError);
    
    expect(appError.code).toBe(ErrorCode.RESOURCE_NOT_FOUND);
    expect(appError.message).toBe('Resource not found');
    expect(appError.statusCode).toBe(404);
    expect(appError.details).toEqual({ message: 'Resource not found', details: { id: '123' } });
  });

  it('should handle network errors', () => {
    const networkError = {
      code: 'NETWORK_ERROR',
      message: 'Network connection failed'
    };
    
    const appError = createAppError(networkError);
    
    expect(appError.code).toBe(ErrorCode.NETWORK_ERROR);
    expect(appError.message).toBe(ERROR_MESSAGES[ErrorCode.NETWORK_ERROR]);
  });

  it('should handle generic Error objects', () => {
    const genericError = new Error('Something went wrong');
    
    const appError = createAppError(genericError);
    
    expect(appError.code).toBe(ErrorCode.UNKNOWN_ERROR);
    expect(appError.message).toBe('Something went wrong');
  });

  it('should handle unknown error types', () => {
    const unknownError = 'string error';
    
    const appError = createAppError(unknownError);
    
    expect(appError.code).toBe(ErrorCode.UNKNOWN_ERROR);
    expect(appError.message).toBe(ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR]);
  });
});

describe('getUserFriendlyMessage', () => {
  it('should return user-friendly message for AppError', () => {
    const appError = {
      code: ErrorCode.VALIDATION_ERROR,
      message: 'Technical validation error'
    };
    
    const friendlyMessage = getUserFriendlyMessage(appError);
    expect(friendlyMessage).toBe(ERROR_MESSAGES[ErrorCode.VALIDATION_ERROR]);
  });

  it('should return user-friendly message for Error object', () => {
    const error = new Error('Technical error message');
    
    const friendlyMessage = getUserFriendlyMessage(error);
    expect(friendlyMessage).toBe(ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR]);
  });

  it('should fallback to original message for unknown error codes', () => {
    const appError = {
      code: 'CUSTOM_ERROR_CODE' as ErrorCode,
      message: 'Custom error message'
    };
    
    const friendlyMessage = getUserFriendlyMessage(appError);
    expect(friendlyMessage).toBe('Custom error message');
  });
});

describe('ERROR_MESSAGES', () => {
  it('should have Korean messages for all error codes', () => {
    const errorCodes = Object.values(ErrorCode);
    
    errorCodes.forEach(code => {
      expect(ERROR_MESSAGES[code]).toBeDefined();
      expect(typeof ERROR_MESSAGES[code]).toBe('string');
      expect(ERROR_MESSAGES[code].length).toBeGreaterThan(0);
    });
  });

  it('should have appropriate Korean messages', () => {
    expect(ERROR_MESSAGES[ErrorCode.NETWORK_ERROR]).toContain('네트워크');
    expect(ERROR_MESSAGES[ErrorCode.UNAUTHORIZED]).toContain('로그인');
    expect(ERROR_MESSAGES[ErrorCode.VALIDATION_ERROR]).toContain('입력');
    expect(ERROR_MESSAGES[ErrorCode.SERVER_ERROR]).toContain('서버');
  });
});