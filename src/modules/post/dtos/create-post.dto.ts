// src/post/dto/create-post.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { PostType } from '@prisma/client';

export class CreatePostDto {
  @ApiProperty({
    enum: PostType,
    description:
      'Loại bài đăng: yêu cầu (request) hoặc cung cấp dịch vụ (offer)',
  })
  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  @ApiProperty({ description: 'Loại hàng hóa', required: false })
  @IsString()
  @IsOptional()
  cargoType?: string;

  @ApiProperty({ description: 'Loại xe', required: false })
  @IsString()
  @IsOptional()
  vehicleType?: string;

  @ApiProperty({ description: 'Số lượng hàng hóa', required: false })
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiProperty({ description: 'Nơi bắt đầu vận chuyển' })
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiProperty({ description: 'Nơi kết thúc vận chuyển' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({ description: 'Thời gian vận chuyển dự kiến', required: false })
  @IsOptional()
  transportTime?: Date;
}
