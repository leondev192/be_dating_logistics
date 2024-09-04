// src/modules/auth/dtos/forgot-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng để nhận mã OTP quên mật khẩu',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
