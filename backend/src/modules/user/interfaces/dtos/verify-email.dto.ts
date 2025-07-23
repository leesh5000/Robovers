import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '인증할 이메일',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty({
    example: 'verification-token-string',
    description: '이메일 인증 토큰',
  })
  @IsString()
  verificationToken: string;
}

export class VerifyEmailResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;
}