import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty({ example: 'postId123', description: 'ID của bài đăng chính' })
  @IsString()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({
    example: 'matchedPostId123',
    description: 'ID của bài đăng ghép đôi',
  })
  @IsString()
  @IsNotEmpty()
  matchedPostId: string;
}

export class UpdateMatchDto {
  @ApiProperty({ example: 'confirmed', description: 'Trạng thái ghép đôi' })
  @IsString()
  status: string;
}

export class SendMessageDto {
  @ApiProperty({ example: 'matchId123', description: 'ID của ghép đôi' })
  @IsString()
  @IsNotEmpty()
  matchId: string;

  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'Nội dung tin nhắn',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
