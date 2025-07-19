import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ example: '123456', description: '6-digit verification code' })
  @IsString()
  @Length(6, 6, { message: 'Verification code must be exactly 6 digits' })
  code: string;
}