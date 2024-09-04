// src/modules/match/dtos/confirm-match.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmMatchDto {
  @ApiProperty({ description: 'ID của bài đăng chính' })
  @IsString()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({ description: 'ID của bài đăng ghép đôi' })
  @IsString()
  @IsNotEmpty()
  matchedPostId: string;
}
