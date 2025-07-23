import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength, Matches, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    example: '새로운닉네임',
    description: '변경할 닉네임',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' })
  @MaxLength(20, { message: '닉네임은 최대 20자까지 가능합니다.' })
  @Matches(/^[가-힣a-zA-Z0-9]+$/, {
    message: '닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.',
  })
  nickname?: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: '프로필 이미지 URL',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: '올바른 URL 형식이 아닙니다.' })
  profileImageUrl?: string;
}

export class UpdateProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  profileImageUrl: string | null;
}