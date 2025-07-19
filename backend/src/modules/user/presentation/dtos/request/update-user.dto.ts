import { IsString, IsOptional, IsUrl, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'john_doe' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_-]{2,20}$/, {
    message: 'Nickname can only contain letters, numbers, hyphens, and underscores',
  })
  nickname?: string;

  @ApiPropertyOptional({ example: 'Software engineer passionate about robotics' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsUrl()
  profileImageUrl?: string;
}