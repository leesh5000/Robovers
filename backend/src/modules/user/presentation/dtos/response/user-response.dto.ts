import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User, UserRole } from '../../../domain/entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  profileImageUrl?: string;

  @ApiPropertyOptional()
  bio?: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email.value;
    this.username = user.username.value;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.profileImageUrl = user.profileImageUrl;
    this.bio = user.bio;
    this.role = user.role;
    this.isActive = user.isActive;
    this.emailVerified = user.emailVerified;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}