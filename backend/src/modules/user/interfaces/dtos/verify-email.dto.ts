import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '인증할 이메일 주소',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일은 필수입니다.' })
  email: string;

  @ApiProperty({
    example: '123456',
    description: '6자리 인증 코드',
  })
  @IsString()
  @IsNotEmpty({ message: '인증 코드는 필수입니다.' })
  @Matches(/^\d{6}$/, { message: '인증 코드는 6자리 숫자여야 합니다.' })
  code: string;
}

export class VerifyEmailResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;
}
