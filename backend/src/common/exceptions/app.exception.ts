import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    messageOrResponse: string | object,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    errorCode?: string,
  ) {
    if (typeof messageOrResponse === 'string') {
      super(
        {
          statusCode,
          message: messageOrResponse,
          errorCode,
          timestamp: new Date().toISOString(),
        },
        statusCode,
      );
    } else {
      super(messageOrResponse, statusCode);
    }
  }
}

export class UnauthorizedException extends AppException {
  constructor(message = '인증이 필요합니다') {
    super(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
  }
}

export class ForbiddenException extends AppException {
  constructor(message = '접근 권한이 없습니다') {
    super(message, HttpStatus.FORBIDDEN, 'FORBIDDEN');
  }
}

export class NotFoundException extends AppException {
  constructor(message = '리소스를 찾을 수 없습니다') {
    super(message, HttpStatus.NOT_FOUND, 'NOT_FOUND');
  }
}

export class ConflictException extends AppException {
  constructor(message = '중복된 데이터입니다') {
    super(message, HttpStatus.CONFLICT, 'CONFLICT');
  }
}

export class ValidationException extends AppException {
  constructor(message = '유효하지 않은 입력입니다') {
    super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR');
  }
}

export class EmailNotVerifiedException extends AppException {
  constructor(
    message = '이메일 인증이 필요합니다',
    public readonly email?: string,
  ) {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message,
        errorCode: 'EMAIL_NOT_VERIFIED',
        email,
        needEmailVerification: true,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
