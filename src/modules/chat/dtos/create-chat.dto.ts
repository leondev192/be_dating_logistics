import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  postId: string;

  @IsNotEmpty()
  @IsString()
  receiverId: string;
}
