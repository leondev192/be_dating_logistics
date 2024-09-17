// src/modules/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng để đăng nhập',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mật khẩu của người dùng',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class GoogleLoginDto {
  @ApiProperty({
    example: '1234567890',
    description: 'Google ID of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  idGoogle: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email of the user',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'URL of the user’s profile picture',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  profilePictureUrl: string;
}
