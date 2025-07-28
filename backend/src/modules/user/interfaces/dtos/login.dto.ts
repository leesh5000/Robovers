import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '사용자 이메일',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: '비밀번호',
  })
  @IsString()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: '사용자 정보',
  })
  user: {
    id: string;
    email: string;
    nickname: string;
    profileImageUrl: string | null;
    role: string;
    isActive: boolean;
    emailVerified: boolean;
  };

  @ApiProperty({
    description: '액세스 토큰',
  })
  accessToken: string;

  @ApiProperty({
    description: '리프레시 토큰',
  })
  refreshToken: string;
}
