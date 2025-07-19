import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';
import { User } from '../../../domain/entities/user.entity';

export class AuthResponseDto {
  @ApiProperty()
  user: UserResponseDto;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  constructor(data: { user: User; accessToken: string; refreshToken: string }) {
    this.user = new UserResponseDto(data.user);
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
  }
}