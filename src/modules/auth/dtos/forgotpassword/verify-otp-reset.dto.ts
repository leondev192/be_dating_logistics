// src/modules/auth/dtos/verify-otp-reset.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpResetDto {
  @ApiProperty({
    example: 'user@example.com',
    description:
      'Email của người dùng để xác minh OTP cho việc đặt lại mật khẩu',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Mã OTP được gửi đến email của người dùng để đặt lại mật khẩu',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
