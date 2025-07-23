import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty({ nullable: true })
  profileImageUrl: string | null;

  @ApiProperty()
  role: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ nullable: true })
  lastLoginAt: Date | null;
}