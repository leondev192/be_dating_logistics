// src/modules/auth/dtos/reset-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'reset-token-123',
    description: 'Mã token được cấp khi xác minh OTP để đặt lại mật khẩu',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'Mật khẩu mới để đặt lại cho người dùng',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
